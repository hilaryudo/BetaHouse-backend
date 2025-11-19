const Property = require('../models/property');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const propertyError = require('../utils/propertyError');

const getProperties = async (req, res) => {
    try {
        const { search, location, title,  minPrice, maxPrice, numberOfBedrooms, sort = "default", page = 1, limit = 9 } = req.query;
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
        

        let priceFilter = {};
        if (minPrice) priceFilter.$gte = Number(minPrice.replace(/,/g, ''));
        if (maxPrice) priceFilter.$lte = Number(maxPrice.replace(/,/g, ''));
        if (minPrice || maxPrice) {
            query.price = priceFilter;
        }
        
        if (numberOfBedrooms) {
            query.numberOfBedrooms = Number(numberOfBedrooms);
        }

        const skip = (page - 1) * limit;

        let sortOption = {};
        if (sort === "newest") sortOption = { createdAt: -1 };
        if (sort === "price-high") sortOption = { priceNumber: -1 };
        if (sort === "price-low") sortOption = { priceNumber: 1 };


        const properties = await Property.find(query).lean();
        properties = properties.map((p) => ({
            ...p,
            priceNumber: Number(p.price.replace(/,/g, '')), 
        }));

        if (sort === "price-high") {
            properties.sort((a, b) => b.priceNumber - a.priceNumber);
        }else if (sort === "price-low") {
            properties.sort((a, b) => a.priceNumber - b.priceNumber);
        };
        

        const total = await Property.countDocuments(query);
        const paginated = properties.slice(skip, skip + Number(limit));

        res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), properties: paginated });
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