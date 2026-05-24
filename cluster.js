const cluster = require("cluster");
const os = require("os");

const totalCPUs = os.cpus().length;

if(cluster.isPrimary){
    console.log(`Primary process ${process.pid}`);

    for(let i=0;i<totalCPUs;i++){
        cluster.fork();
    }

    cluster.on("exit",(worker)=>{
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    })
}
else{
    require("./server");
}