const Car = require('../models/Car');
const fs = require('fs');
const path = require('path');

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('owner', 'name email');
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name email');
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new car with photos
exports.createCar = async (req, res) => {
  try {
    const { make, model, year, price, mileage, description, owner } = req.body;
    
    // Process uploaded photos
    const photos = req.files ? req.files.map(file => ({
      filename: file.originalname,
      filepath: `/uploads/${file.filename}`
    })) : [];

    const car = new Car({
      make,
      model,
      year,
      price,
      mileage,
      description,
      photos,
      owner
    });

    await car.save();
    const populatedCar = await car.populate('owner', 'name email');
    res.status(201).json(populatedCar);
  } catch (error) {
    // Delete uploaded files if car creation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(path.join(__dirname, '../uploads', file.filename));
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update car
exports.updateCar = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };

    // Handle new photo uploads
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => ({
        filename: file.originalname,
        filepath: `/uploads/${file.filename}`
      }));
      updateData.photos = newPhotos;
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'name email');

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    // Delete uploaded files if update fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(path.join(__dirname, '../uploads', file.filename));
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Upload additional photos to existing car
exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const car = await Car.findById(req.params.id);
    if (!car) {
      // Delete uploaded files if car not found
      req.files.forEach(file => {
        fs.unlinkSync(path.join(__dirname, '../uploads', file.filename));
      });
      return res.status(404).json({ error: 'Car not found' });
    }

    // Add new photos to existing photos
    const newPhotos = req.files.map(file => ({
      filename: file.originalname,
      filepath: `/uploads/${file.filename}`
    }));

    car.photos = [...car.photos, ...newPhotos];
    car.updatedAt = Date.now();
    await car.save();

    const updatedCar = await car.populate('owner', 'name email');
    res.status(200).json({
      message: 'Photos uploaded successfully',
      car: updatedCar
    });
  } catch (error) {
    // Delete uploaded files if upload fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(path.join(__dirname, '../uploads', file.filename));
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Delete associated photos from filesystem
    car.photos.forEach(photo => {
      const filepath = path.join(__dirname, '../uploads', path.basename(photo.filepath));
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
