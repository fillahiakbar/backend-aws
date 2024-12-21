const express = require('express');
const workout = require('./src/routes/workout');  // Mengimpor file router
require('dotenv').config();

const app = express();
const port = 4000;

// Parsing JSON body request
app.use(express.json()); 

// Menggunakan router untuk menangani rute '/api/workouts'
app.use('/api', workout);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
