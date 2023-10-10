const db = require('../models')
const { body, validationResult, check } = require("express-validator");
const axios = require('axios');
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/', '.env') })

/* create main Model */
const Review = db.review
const Newsletter = db.newsletter

/* Validate email new Review */
const validateEmailReview = [
    check("email", "Email invalid!").isEmail().trim().escape().normalizeEmail()
];

/* static reviews */
const staticReviews = [
    {
        "id": 1,
        "email": "ibrahim@gmail.com",
        "name": "Ibrahim",
        "message": "Excellent",
    },
    {
        "id": 2,
        "email": "nana@gmail.com",
        "name": "Nana",
        "message": "Nice",
    },
    {
        "id": 3,
        "email": "andi@gmail.com",
        "name": "Andi",
        "message": "Good",
    },
    {
        "id": 4,
        "email": "haizum@gmail.com",
        "name": "Haizum",
        "message": "Delightful",
    },
]

/* mengembalikan data sebagai JSON  dan mengembalikannya sebagai string */
const reviewsJSON = JSON.stringify(staticReviews);

/* main work */

/* 1. create Review */
const createReview = async (req, res) => {
    const { email, name, message, captchaResponse } = req.body;

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation error' });
        }

        /* Verify reCAPTCHA */
        const secretKey = process.env.REVIEW_RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

        const response = await axios.post(verifyUrl);
        const body = response.data;

        /* give console because sometimes captcha not working if it didn't get called */
        console.log(captchaResponse);

        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, message: 'Failed reCAPTCHA verification' });
        }

        /* Continue processing the form data */
        const checkEmail = await Newsletter.findOne({ where: { email } })

        /* Jika data ditemukan, ambil ID-nya */
        if (!checkEmail) {
            return res.status(400).json({ error: 'Email Anda tidak terdaftar, silahkan bergabung dengan kami di Newsletter' });
        } else {
            const id_newsletter = checkEmail.id;
            const review = await Review.create({
                name, message, id_newsletter
            });
            return res.status(201).json({ message: 'Review created successfully', data: review });
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/* 2. get all Reviews */
const getAllReview = async (req, res) => {
    try {
        const review = await Review.findAll({})

        if (review.length === 0) {
            res.status(200).json({ message: 'No data Review' })
        }

        res.status(200).send(review)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* 3. get single Review */
const getOneReview = async (req, res) => {
    try {
        const id = req.params.id
        const review = await Review.findOne({ where: { id } })

        if (!review) {
            return res.status(200).json({ message: 'Data tidak ditemukan' });
        }

        res.status(200).send(review)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

/* 4. update Review */
const updateReview = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation error' });
        } else {
            const id = req.params.id
            const review = await Review.findOne({ where: {id } });

            if (!review) {
                return res.status(200).json({ message: 'Tidak dapat melakukan update, karena data tidak ditemukan' });
            }

            const updatedReview = await Review.update(req.body, { where: { id } });

            return res.status(200).json({ message: 'Newsletter updated successfully', data: updatedReview });
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

/* 5. delete Review by id */
const deleteReview = async (req, res) => {
    try {
        const id = req.params.id

        const review = await Review.findOne({ where: { id } });

        if (!review) {
            return res.status(200).json({ message: 'Tidak dapat melakukan delete, karena data tidak ditemukan' });
        }

        await Review.destroy({ where: { id } })
        res.status(200).send('Review is deleted !')
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

/* 6. get data reviews from database based on order by id desc */
const fetchReviewsFromDatabase = async () => {
    try {
        const results = await Review.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
        });
        return results;
    } catch (error) {
        console.error("Error fetching Reviews:", error);
        throw error;
    }
};

/* 7. fetch Sentiment From API */
const fetchSentimentFromAPI = async (data) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/w11wo/indonesian-roberta-base-sentiment-classifier",
            {
                headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        const sentimentResults = await response.json();
        return sentimentResults;
    } catch (err) {
        console.error("Error: ", err);
        throw error;
    }
};

/* 8. analyze reviews by API */
const analyzeReviews = async (result) => {
    try {
        const message = result.message;

        /* Prepare data for API request */
        const data = [{ text: message }];

        /* Sending request to Hugging Face API */
        const sentimentResults = await fetchSentimentFromAPI(data);
        return sentimentResults;
    } catch (error) {
        console.error("Error analyze Reviews:", error);
        throw error;
    }
};

/* 9. find review based on label negative, label neutral and lowest score */
const findIndexLowestNegativeNeutralScore = (sentimentResults) => {
    /* give console because sometimes we hit a limit when using the Inference API with a free account */
    // console.log('sentimentResults:', sentimentResults);

    try {
        /* Pastikan sentimentResults adalah array dengan struktur yang benar */
        if (!Array.isArray(sentimentResults) || sentimentResults.length === 0 || !Array.isArray(sentimentResults[0])) {
            return staticReviews;
        }

        /* Find the sentiment result with the highest score */
        const labelWithHighestScore = sentimentResults.map(result => {
            return result.reduce((prev, current) => {
                return (current.score > prev.score) ? current : prev;
            });
        });

        /* Find the index of the candidate with the negative label and neutral label*/
        /* Mencari nilai yang mengandung label negative dan label neutral */
        const lowestScoreIndex = labelWithHighestScore.findIndex(
            item => item.label === "negative" || item.label === "neutral"
        );

        return lowestScoreIndex;
    } catch (error) {
        // sentimentResults: {
        //     error: 'Rate limit reached. You reached free usage limit (reset hourly). Please subscribe to a plan at https://huggingface.co/pricing to use the API at this rate'
        //   }

        // sentimentResults: {
        //     error: 'Model w11wo/indonesian-roberta-base-sentiment-classifier is currently loading',
        //     estimated_time: 20
        //   }
        console.error("Error find score label positive Reviews:", error);
        throw error;
    }

};

/* 10. get reviews label positive */
const getReviews = async (req, res) => {
    try {
        let continueProcessing = true;
        const dataToSend = []; // Initialize an array to accumulate data for the response
        let dataNoSend = [];
        let subsetOfData;

        while (continueProcessing) {
            const results = await fetchReviewsFromDatabase();

            if (results.length === 0) {
                continueProcessing = false;
                // res.json("No more candidates to analyze.");
                return res.status(200).json(JSON.parse(reviewsJSON)); /* convert data dari JSON kembali ke objek JavaScript */
            }

            for (let i = 0; i <= results.length - 1; i++) {
                const currentResult = results[i];

                const sentimentResults = await analyzeReviews(currentResult);
                const lowestScoreIndex = findIndexLowestNegativeNeutralScore(sentimentResults)

                if (lowestScoreIndex !== -1) {
                    dataNoSend.push(currentResult);
                    // return res.json(JSON.parse(reviewsJSON)); /* convert data dari JSON kembali ke objek JavaScript */
                } else {
                    dataToSend.push(currentResult);
                }
            }

            continueProcessing = false;

            // res.json(dataToSend);
        }

        if (dataToSend.length >= 5) {
            subsetOfData = dataToSend.slice(0, 5);
        } else if (dataToSend.length >= 4) {
            subsetOfData = dataToSend.slice(0, 4);
        } else if (dataToSend.length >= 3) {
            subsetOfData = dataToSend.slice(0, 3);
        } else if (dataToSend.length >= 2) {
            subsetOfData = dataToSend.slice(0, 2);
        } else if (dataToSend.length >= 1) {
            subsetOfData = dataToSend.slice(0, 1);
        } else if (dataToSend.length <= 0) {
            subsetOfData = JSON.parse(reviewsJSON);
        }

        res.status(200).json(subsetOfData);
        // console.log(dataToSend.length);
    } catch (error) {
        console.error("Error get Reviews:", error);
        return res.json(JSON.parse(reviewsJSON)); /* convert data dari JSON kembali ke objek JavaScript */
    }
};


// The mark is to disable the code line
/* The mark is to provide info related to the code explanation */

module.exports = {
    validateEmailReview,
    createReview,
    getAllReview,
    getOneReview,
    updateReview,
    deleteReview,
    getReviews
};