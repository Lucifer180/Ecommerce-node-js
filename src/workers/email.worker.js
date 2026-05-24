const { Worker } = require("bullmq");
const connection = require("../config/queue");

const worker = new Worker("emailQueue",
    async (job)=>{
        console.log("Processing job");
        console.log(job.data);

        await new Promise((resolve)=>setTimeout(resolve,3000));
        
        console.log("Job completed");
    },
    {connection}
);

worker.on("completed",(job)=>{
    console.log(`Job ${job.id} completed`);
});

worker.on("failed",(job,err)=>{
    console.log(`Job ${job.id} failed with error ${err.message}`);
})

