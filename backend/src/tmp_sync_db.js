import sequelize from "./config/db.js";
import Voucher from "./models/voucher.model.js";

async function syncDB() {
    try {
        console.log("Syncing database...");
        await sequelize.sync({ alter: true });
        console.log("Database synced successfully!");
        
        const [results] = await sequelize.query("DESCRIBE vouchers");
        console.log("NEW TABLE STRUCTURE:", JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("ERROR SYNCING DATABASE:", error.message);
    } finally {
        process.exit(0);
    }
}

syncDB();
