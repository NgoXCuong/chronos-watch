import sequelize from "./config/db.js";

async function checkTable() {
    try {
        const [results] = await sequelize.query("DESCRIBE vouchers");
        console.log("TABLE STRUCTURE:", JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("ERROR DESCRIBING TABLE:", error.message);
    } finally {
        process.exit(0);
    }
}

checkTable();
