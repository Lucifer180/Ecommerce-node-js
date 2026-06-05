const app = require("./src/app");
const connectDb = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

process.on("uncaughtException",(err)=>{
    console.error("UNCAUGHT EXCEPTION",err);

    process.exit(1);
});

process.on("unhandledRejection",(err)=>{
    console.error("UNHANDLED REJECTION",err);

    process.exit(1);
});

connectDb();
connectRedis();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})