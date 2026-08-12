const fs = require('fs');

const uploadFile = async () => {
    try {
        const file = fs.readFileSync("/app/test.txt");

        const response = await fetch("http://localhost:5000/api/uploads/presigned-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileName: "test.txt",
                fileType: "text/plain"
            })
        });

        if (!response.ok) {
            throw new Error(
                `Failed to get presigned URL: ${response.status}`
            );
        };

        const { uploadUrl, key } = await response.json();

        console.log("Presigned URL received");
        console.log("S3 Key:", key);

        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "text/plain"
            },
            body: file,

        });

        if (!uploadResponse.ok) {
            throw new Error(
                `S3 upload failed: ${uploadResponse.status}`
            );
        };

        console.log("file uploaded directly to s3 bucket");
        console.log("key", key);
    } catch (error) {
        console.error("Upload failed:", error);
    }
};

uploadFile();