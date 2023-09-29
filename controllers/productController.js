const db = require('../models')
const multer = require('multer');
const fs = require('fs');
const { body, validationResult, check } = require("express-validator");

// create main Model
const Product = db.products

// main work

// 1. create products
const createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const image = fs.readFileSync(req.file.path);

        const productName = req.body.productName;
        const productPrice = req.body.productPrice;
        const productCategory = req.body.productCategory;

        const newProduct = await Product.create({ productName, productPrice, productCategory, image });

        fs.unlinkSync(req.file.path);

        return res.status(201).json({ message: 'Gambar berhasil diunggah dan disimpan di database.', data: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memproses permintaan.' });
    }
};

// 2. get all Product
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        if (!products) {
            return res.status(200).json({ message: 'Tidak ada produk ditemukan' });
        }

        const productsWithBase64Images = products.map(product => {
            const imageBuffer = product.image;
            const imageData = imageBuffer.toString('base64');

            return {
                id: product.id,
                productName: product.productName,
                productPrice: product.productPrice,
                productCategory: product.productCategory,
                image: imageData
            };
        });

        res.status(200).send(productsWithBase64Images);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 3. get one products
const getOneProduct = async (req, res) => {
    try {
        const id = req.params.id
        const products = await Product.findOne({ where: { id } })

        if (!products) {
            return res.status(200).json({ message: 'Data tidak ditemukan' });
        }

        res.status(200).send(products)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 4. get products by category
const getProductByCategory = async (req, res) => {
    try {
        const productCategory = req.params.productCategory
        const products = await Product.findAll({ where: { productCategory } })

        if (!products) {
            return res.status(200).json({ message: 'Data tidak ditemukan' });
        }

        const productsWithBase64Images = products.map(product => {
            const imageBuffer = product.image; // Ganti 'image' dengan nama kolom BLOB di model Anda
            const imageData = imageBuffer.toString('base64');

            return {
                id: product.id,
                productName: product.productName,
                productPrice: product.productPrice,
                productCategory: product.productCategory,
                image: imageData // Mengirimkan gambar dalam format base64
            };
        });

        res.status(200).send(productsWithBase64Images)
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// 5. update products
const updateProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const id = req.params.id
        const image = fs.readFileSync(req.file.path);

        const productName = req.body.productName;
        const productPrice = req.body.productPrice;
        const productCategory = req.body.productCategory;

        const product = await Product.findOne({ where: { id } });

        if (!product) {
            return res.status(200).json({ message: 'Tidak dapat melakukan update, karena data tidak ditemukan' });
        } else {
            await Product.update(
                { productName, productPrice, productCategory, image },
                { where: { id } }
            );

            const updatedProduct = await Product.findOne({ where: { id } });

            fs.unlinkSync(req.file.path);

            return res.status(200).json({
                message: 'Product updated successfully',
                data: updatedProduct,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memproses permintaan.' });
    }
}

// 6. delete products
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id

        const product = await Product.findOne({ where: { id } });

        if (!product) {
            return res.status(200).json({ message: 'Tidak dapat melakukan delete, karena data tidak ditemukan' });
        }

        await Product.destroy({ where: { id } })
        res.status(200).send('Product was deleted !')
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getProductByCategory
};