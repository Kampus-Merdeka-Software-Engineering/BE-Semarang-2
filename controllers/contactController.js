const db = require('../models')
const { body, validationResult, check } = require("express-validator");
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/', '.env') })

/* create main Model */
const Contact = db.contacts

/* Validate email contact */
const validateContact = [
    check("email", "Email invalid!").isEmail().trim().escape().normalizeEmail()
];

/* main work */

/* 1. create contact */
const createContact = async (req, res) => {
    const { firstName, lastName, email, message, captchaResponse } = req.body;
    let noHp = req.body.noHp

    try {
        const errors = validationResult(req);

        /* Verify reCAPTCHA */
        const secretKey = process.env.CONTACT_RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

        const response = await axios.post(verifyUrl);
        const body = response.data;

        console.log(response);
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, message: 'Failed reCAPTCHA verification' });
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Email invalid!' });
        }

        /* Continue processing the form data */
        if (noHp === '') {
            noHp = null;
        }

        const newContact = await Contact.create({
            firstName,
            lastName,
            email,
            noHp,
            message,
        });

        return res.status(201).json({ message: 'Contact created successfully' });
        // return res.json({ success: true, message: 'reCAPTCHA verified successfully' });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/* 2. get all contacts */
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({})

        if (contacts.length === 0) {
            res.status(200).json({ message: 'No data Contacts' })
        }

        res.status(200).send(contacts)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* 3. get single contacts */
const getOneContact = async (req, res) => {
    try {
        const id = req.params.id
        const contact = await Contact.findOne({ where: { id } })

        if (!contact) {
            return res.status(200).json({ message: 'Data tidak ditemukan' });
        }

        res.status(200).send(contact)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* 4. update contact */
const updateContact = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation error' });
        } else {
            const id = req.params.id
            const contact = await Contact.findOne({ where: { id } });

            if (!contact) {
                return res.status(200).json({ message: 'Tidak dapat melakukan update, karena data tidak ditemukan' });
            }

            if (req.body.noHp === '') {
                req.body.noHp = null;
            }

            const updatedContact = await Contact.update(req.body, { where: { id } });

            return res.status(200).json({ message: 'Contact updated successfully', data: updatedContact });
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* 5. delete contact by id */
const deleteContact = async (req, res) => {
    try {
        const id = req.params.id

        const contact = await Contact.findOne({ where: { id } });

        if (!contact) {
            return res.status(200).json({ message: 'Tidak dapat melakukan delete, karena data tidak ditemukan' });
        }

        await Contact.destroy({ where: { id } })
        res.status(200).send('contact is deleted !')
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    validateContact,
    createContact,
    getAllContacts,
    getOneContact,
    updateContact,
    deleteContact
}