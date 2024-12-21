const express = require('express');
const router = express.Router();
const { 
    uploadVideo, 
    // addWorkoutProgram, 
    getAllWorkoutPrograms, 
    upload 
} = require('../controllers/workoutController');

// Route untuk upload video
router.post('/workouts', upload.single('video'), uploadVideo); // Menangani upload video ke S3 dan menyimpan URL ke MongoDB

// Route untuk CRUD workout
// router.post('/workouts', addWorkoutProgram); // Menambahkan program workout baru
router.get('/workouts', getAllWorkoutPrograms); // Mengambil semua program workout


module.exports = router;
