const db = require('../models/db');
const { Status } = require('@prisma/client');

exports.getBySerial = async (req, res, next) => {
    try {
        const { ProductId } = req.query;
        const SerialNumber = await db.SerialNumber.findMany({
            where: {
                ProductId: parseInt(ProductId)
            }
        });
        res.json({ SerialNumber });
    } catch (err) {
        next(err);
    }
};

exports.createSerial = async (req, res, next) => {
    try {
        const data = req.body;
        const { ProductId } = req.query;
        if (!ProductId) {
            return res.status(400).json({ message: 'ProductId is required' });
        }

        const newSerial = await db.SerialNumber.create({
            data: { ...data, ProductId: Number(ProductId) }
        });
        res.status(201).json({ message: 'Serial created successfully', SerialNumber: newSerial });
    } catch (error) {
        next(error);
    }
};

exports.deleteSerialById = async (req, res, next) => {
    try {
        const SerialID = parseInt(req.params.id);
        await db.SerialNumber.delete({
            where: { id: SerialID }
        });
        res.status(200).json({ message: 'Serial deleted successfully' });
    } catch (error) {
        next(error);
    }
};
