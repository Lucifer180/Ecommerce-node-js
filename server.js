const app = require("./src/app");
const connectDb = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDb();
connectRedis();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})