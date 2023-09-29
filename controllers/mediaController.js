const db = require('../models')
const multer = require('multer');
const fs = require('fs');
const { body, validationResult, check } = require("express-validator");

// create main Model
const Media = db.medias

// main work

// 1. create media
const createMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const mediaImage = fs.readFileSync(req.file.path);

        const mediaTitle = req.body.mediaTitle;
        const mediaDate = req.body.mediaDate;

        const newMedia = await Media.create({ mediaTitle, mediaDate, mediaImage });

        fs.unlinkSync(req.file.path);

        return res.status(201).json({ message: 'Gambar berhasil diunggah dan disimpan di database.', data: newMedia });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memproses permintaan.' });
    }
};

// 2. get all media
const getAllMedia = async (req, res) => {
    try {
        const medias = await Media.findAll();

        if (!medias) {
            return res.status(200).json({ message: 'Tidak ada media ditemukan' });
        }

        const mediasWithBase64Images = medias.map(media => {
            const imageBuffer = media.mediaImage;
            const imageData = imageBuffer.toString('base64');

            return {
                id: media.id,
                mediaTitle: media.mediaTitle,
                mediaDate: media.mediaDate,
                mediaImage: imageData
            };
        });

        res.status(200).send(mediasWithBase64Images);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 3. get one media
const getOneMedia = async (req, res) => {
    try {
        const id = req.params.id
        const medias = await Media.findOne({ where: { id } })

        if (!medias) {
            return res.status(200).json({ message: 'Data tidak ditemukan' });
        }

        res.status(200).send(medias)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 4. get latest media
const getLatestMedia = async (req, res) => {
    try {
        const medias = await Media.findAll({
            order: [['mediaDate', 'DESC']]
        });

        if (!medias) {
            return res.status(200).json({ message: 'Tidak ada media ditemukan' });
        }

        const mediaWithBase64Images = medias.map(media => {
            const imageBuffer = media.mediaImage;
            const imageData = imageBuffer.toString('base64');

            return {
                id: media.id,
                mediaTitle: media.mediaTitle,
                mediaDate: media.mediaDate,
                mediaImage: imageData
            };
        });

        res.status(200).send(mediaWithBase64Images);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 5. update media
const updateMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const id = req.params.id
        const mediaImage = fs.readFileSync(req.file.path);

        const mediaTitle = req.body.mediaTitle;
        const mediaDate = req.body.mediaDate;

        const media = await Media.findOne({ where: { id } });

        if (!media) {
            return res.status(200).json({ message: 'Tidak dapat melakukan update, karena data tidak ditemukan' });
        } else {
            await Media.update(
                { mediaTitle, mediaDate, mediaImage },
                { where: { id } }
            );

            const updatedMedia = await Media.findOne({ where: { id } });

            fs.unlinkSync(req.file.path);

            return res.status(200).json({
                message: 'Media updated successfully',
                data: updatedMedia,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memproses permintaan.' });
    }
}

// 6. delete media
const deleteMedia = async (req, res) => {
    try {
        const id = req.params.id

        const media = await Media.findOne({ where: { id } });

        if (!media) {
            return res.status(200).json({ message: 'Tidak dapat melakukan delete, karena data tidak ditemukan' });
        }

        await Media.destroy({ where: { id } })
        res.status(200).send('Media was deleted !')
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createMedia,
    getAllMedia,
    getOneMedia,
    updateMedia,
    deleteMedia,
    getLatestMedia
};