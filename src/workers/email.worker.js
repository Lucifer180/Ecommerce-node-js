const { Worker } = require("bullmq");
const connection = require("../config/queue");
const transporter = require("../config/mail");

const worker = new Worker("emailQueue",
    async (job) => {
        console.log(`Processing email job: ${job.name}`);
        console.log(job.data);

        const { to, subject, text, html } = job.data;

        try {
            const info = await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_EMAIL,
                to,
                subject,
                text,
                html,
            });
            console.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            console.error(`Failed to send email:`, error);
            throw error; // Rethrow to let BullMQ handle the retry/failure logic
        }
    },
    {connection}
);

worker.on("completed",(job)=>{
    console.log(`Job ${job.id} completed`);
});

worker.on("failed",(job,err)=>{
    console.log(`Job ${job.id} failed with error ${err.message}`);
})

