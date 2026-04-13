const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const upload = require('../middleware/upload');

// Get all cars
router.get('/', carController.getAllCars);

// Get car by ID
router.get('/:id', carController.getCarById);

// Create a new car with photos
router.post('/', upload.array('photos', 5), carController.createCar);

// Update car
router.put('/:id', upload.array('photos', 5), carController.updateCar);

// Upload additional photos
router.post('/:id/upload-photos', upload.array('photos', 5), carController.uploadPhotos);

// Delete car
router.delete('/:id', carController.deleteCar);

module.exports = router;
