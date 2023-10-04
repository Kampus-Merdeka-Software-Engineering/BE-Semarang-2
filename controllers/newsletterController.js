const db = require('../models')
const { body, validationResult, check } = require("express-validator");
const { Op } = require('sequelize')
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/', '.env') })

// create main Model
const Newsletter = db.newsletter

/* Validate new Newsletter */
const validateNewsletter = [
    check("email", "Email invalid!").isEmail().trim().escape().normalizeEmail()
];

/* check duplicate update newsletter data*/
const checkDuplicateUpdateNewsletter = async (email, excludedId) => {
    const newsletter = await Newsletter.findOne({
        where: {
            email,
            id: { [Op.not]: excludedId },
        },
    });
    return newsletter;
};

// main work

// 1. create Newsletter
const createNewsletter = async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Email invalid!' });
        }

        /* Verify reCAPTCHA */
        const secretKey = process.env.NEWSLETTER_RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        const response = await axios.post(verifyUrl);
        const body = response.data;

        // console.log('Received Token:', token); // Log the token value
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, message: 'Failed reCAPTCHA verification' });
        }

        /* Continue processing the form data */
        /* Check for duplicates based on email*/
        const duplicateNewsletter = await Newsletter.findAll({ where: { email } });

        if (duplicateNewsletter.length > 0) {
            return res.status(400).json({ error: 'Data already exists' });
        }

        /* Continue the process of saving data to the database*/
        const newNewsletter = await Newsletter.create({ email });

        return res.status(201).json({ message: 'Newsletter created successfully', data: newNewsletter });
        // return res.json({ success: true, message: 'reCAPTCHA verified successfully' });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 2. get all Newsletters

const getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await Newsletter.findAll({})

        if (newsletters.length === 0) {
            res.status(200).json({ message: 'No data Newsletters' })
        }

        res.status(200).send(newsletters)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 3. get single Newsletters

const getOneNewsletter = async (req, res) => {
    try {
        const id = req.params.id
        const newsletter = await Newsletter.findOne({ where: { id } })

        if (!newsletter) {
            return res.status(200).json({ message: 'Data tidak ditemukan' });
        }

        res.status(200).send(newsletter)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

// 4. update Newsletter

const updateNewsletter = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation error' });
        }

        const id = req.params.id
        const email = req.body.email

        const newsletter = await Newsletter.findOne({ where: { id } });

        if (!newsletter) {
            return res.status(200).json({ message: 'Tidak dapat melakukan update, karena data tidak ditemukan' });
        } else {
            /* Check for duplicates based on email*/
            const duplicateNewsletter = await checkDuplicateUpdateNewsletter(email, id);

            if (duplicateNewsletter) {
                return res.status(400).json({ error: 'Data already exists' });
            } else {
                // Continue the process of saving data to the database
                const updatedNewsletter = await Newsletter.update(
                    { email },
                    { where: { id } }
                );

                return res.status(200).json({
                    message: 'Newsletter updated successfully',
                    data: updatedNewsletter,
                });
            }
        }

    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 5. delete Newsletter by id

const deleteNewsletter = async (req, res) => {
    try {
        const id = req.params.id

        const newsletter = await Newsletter.findOne({ where: {id } });

        if (!newsletter) {
            return res.status(200).json({ message: 'Tidak dapat melakukan delete, karena data tidak ditemukan' });
        }

        await Newsletter.destroy({ where: {id } })
        res.status(200).send('Newsletter is deleted !')
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {
    validateNewsletter,
    createNewsletter,
    getAllNewsletters,
    getOneNewsletter,
    updateNewsletter,
    deleteNewsletter
}