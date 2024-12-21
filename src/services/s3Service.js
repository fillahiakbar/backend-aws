const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

// Konfigurasi AWS
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFileToS3 = async (file) => {
    const fileExtension = file.originalname.split('.').pop(); // Mendapatkan ekstensi file
    const fileName = `${uuidv4()}.${fileExtension}`; // Membuat nama file unik

    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME, // Nama bucket
        Key: fileName, // Nama file di S3
        Body: file.buffer, // Isi file
        ContentType: file.mimetype, // Tipe konten
    };

    try {
        // Upload file ke S3
        const result = await s3Client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return fileUrl; // Mengembalikan URL file
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

module.exports = { uploadFileToS3 };
