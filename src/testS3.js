const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const s3Client = require("./config/s3");
const dotenv = require("dotenv");

dotenv.config();
const testS3 = async () => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            MaxKeys: 5
        });

        const result = await s3Client.send(command);

        console.log("AWS S3 connection successful!");
        console.log("Bucket:", process.env.AWS_S3_BUCKET_NAME);
        console.log("Objects:", result || []);
    } catch (error) {
        console.error("s3 connection failed");
        console.error(error);
    }
}
testS3();