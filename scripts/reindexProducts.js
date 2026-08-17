const mongoose = require("mongoose");
const elasticClient = require("../src/config/elasticSearch");
const Product = require("../src/modules/products/product.model");

async function waitForElastic(retries = 30, delayMs = 2000) {
    for (let i = 1; i <= retries; i++) {
        try {
            await elasticClient.cluster.health();
            console.log("Elasticsearch is ready");
            return;
        } catch (err) {
            console.log(`Waiting for Elasticsearch... (${i}/${retries})`);
            await new Promise(res => setTimeout(res, delayMs));
        }
    }
    throw new Error("Elasticsearch did not become ready in time");
}

async function reindexProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected ");

        await waitForElastic();

        const products = await Product.find({}).lean();
        console.log(`Found ${products.length} products`);

        for (const product of products) {
            const { _id, ...productData } = product;
            await elasticClient.index({
                index: "products",
                id: _id.toString(),
                document: productData,
            });
        }

        console.log("Products reindexed successfully");
        await mongoose.disconnect();

    } catch (error) {
        console.error("Reindex failed:", error);
        process.exit(1);
    }
}

reindexProducts();