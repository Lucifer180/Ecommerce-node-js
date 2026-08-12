const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3Client = require("./config/s3");

const uploadFile = async () => {
    try {
        const file = fs.readFileSync("/app/test.txt");

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "test/test.txt",
            Body: file,
            ContentType: "text/plain"
        });

        await s3Client.send(command);

        console.log("file upload successfull");
    } catch (error) {
        console.error(error);
        console.error("file upload failed");
    }
};

uploadFile();