const Property = require('../models/property');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const propertyError = require('../utils/propertyError');

const getProperties = async (req, res) => {
    try {
        const { search, location, title,  minPrice, maxPrice, numberOfBedrooms, page = 1, limit = 9 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        };

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (numberOfBedrooms) {
            query.numberOfBedrooms = Number(numberOfBedrooms);
        }

        const skip = (page - 1) * limit;

        let sortOption = {};
        if (sort === "newest") sortOption = { createdAt: -1 };
        if (sort === "priceLowToHigh") sortOption = { price: 1 };
        if (sort === "priceHighToLow") sortOption = { price: -1 };
        const properties = await Property.find(query).sort(sortOption).skip(skip).limit(Number(limit));
        

        const total = await Property.countDocuments(query);

        res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), properties });
    } catch (error) {
        const errors = propertyError(error);
        res.status(500).json({success : false, errors });
    }
};


const getProperty = async (req, res) => {
    const {propertyId} = req.params;
    try {
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        res.status(200).json({ success: true, property });
    } catch (error) {
      const errors = propertyError(error);
        res.status(404).json({success : false, errors });
    }
};


const createProperty = async (req, res) => {
    try {
        const { title, price, location, numberOfBedrooms, numberOfBathrooms } = req.body;

        const image = req.files.image;
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, 
            {
                use_filename: true,
                folder: 'properties'
            });
        fs.unlinkSync(req.files.image.tempFilePath);
        const property = new Property({ title, price, location, numberOfBedrooms, numberOfBathrooms, image: result.secure_url });
        await property.save();
       
        res.status(201).json({ success: true, message: "Property created successfully", property });

    } catch (error) {
      const errors = propertyError(error);
        res.status(400).json({success : false, errors });
        
    }
};

const updateProperty = async (req, res) => {
    const {propertyId} = req.params;
    try {
        const property = await Property.findByIdAndUpdate(propertyId, req.body, { new: true, runValidators: true });
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        res.status(200).json({ success: true, message: "Property updated successfully", property });
    } catch (error) {
        const errors = propertyError(error);
        res.status(400).json({success : false, errors });
    }
};

const deleteProperty = async (req, res) => {
    const {propertyId} = req.params;
    try {
        const property = await Property.findByIdAndDelete(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        res.status(200).json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        const errors = propertyError(error);
        res.status(400).json({success : false, errors });
    }
};

module.exports = { getProperties, getProperty, createProperty, updateProperty, deleteProperty };