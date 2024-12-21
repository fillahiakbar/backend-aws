const multer = require('multer');
const { uploadFileToS3 } = require('../services/s3Service');
const { connectToDatabase } = require('../db');

// Konfigurasi multer untuk upload file
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Limit 100MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only video files are allowed.'));
        }
    }
});

// Handler: Upload video ke S3
async function uploadVideo(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded" });
        }
        console.log('Uploading file:', req.file.originalname);

        // Upload file ke S3 dan dapatkan URL video
        const videoUrl = await uploadFileToS3(req.file);

        // Simpan URL video ke MongoDB
        const db = await connectToDatabase();
        const workoutsCollection = db.collection('workouts');

        const { v4: uuidv4 } = require('uuid'); // Import UUID

        const workoutData = {
            id: uuidv4(), // Tambahkan ID unik
            name: req.body.name,
            description: req.body.description,
            videoUrl, // Simpan URL video S3
            createdAt: new Date(),
            updatedAt: new Date()
        };
        

        await workoutsCollection.insertOne(workoutData);

        res.status(200).json({
            id: workoutData.id,
            message: "Video uploaded and workout program created successfully",
            video_url: workoutData.videoUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            message: "Failed to upload video",
            error: error.message
        });
    }
}

// Handler: Tambah program workout
// async function addWorkoutProgram(req, res) {
//     const { name, description, videoUrl } = req.body;

//     // Validasi input
//     if (!name || !description || !videoUrl) {
//         return res.status(400).json({ message: "Name, description, and video URL are required." });
//     }

//     // Validasi URL S3
//     const urlPattern = /^https:\/\/.*\.s3\..*\.amazonaws\.com\/.*/;
//     if (!urlPattern.test(videoUrl)) {
//         return res.status(400).json({ message: "Invalid S3 video URL format." });
//     }

//     try {
//         const db = await connectToDatabase();
//         const workoutsCollection = db.collection('workouts');

//         const workoutData = {
//             name,
//             description,
//             videoUrl,
//             createdAt: new Date(),
//             updatedAt: new Date()
//         };

//         await workoutsCollection.insertOne(workoutData);

//         res.status(201).json({
//             message: "Workout program created successfully",
//             ...workoutData
//         });
//     } catch (error) {
//         console.error('Error details:', error);
//         res.status(500).json({ 
//             message: "Failed to create workout program.",
//             error: error.message 
//         });
//     }
// }


// Handler: Dapatkan semua program workout
async function getAllWorkoutPrograms(req, res) {
    try {
        const db = await connectToDatabase();
        const workoutsCollection = db.collection('workouts');

        const workoutList = await workoutsCollection.find({}).toArray();

        const formattedWorkouts = workoutList.map(workout => ({
            id: workout._id,  // MongoDB auto-generated ID
            name: workout.name,
            description: workout.description,
            video_url: workout.videoUrl // Ambil URL video dari MongoDB
        }));

        res.status(200).json(formattedWorkouts);
    } catch (error) {
        console.error("Error in retrieving workout programs:", error);
        res.status(500).json({ 
            message: "Failed to retrieve workout programs.", 
            error: error.message 
        });
    }
}


module.exports = { 
    uploadVideo, 
    // addWorkoutProgram, 
    getAllWorkoutPrograms, 
    upload 
};