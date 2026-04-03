require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Schema with flexible fields
const PincodeSchema = new mongoose.Schema({}, { 
    collection: "task_mongo",
    strict: false
});

const Pincode = mongoose.model("Pincode", PincodeSchema);

// Parse CSV file
async function seedDatabase() {
    try {
        const filePath = process.argv[2] || "c:\\Users\\maharshi patel\\Downloads\\all_india_pin_code-2.txt";
        
        if (!fs.existsSync(filePath)) {
            console.error("❌ File not found:", filePath);
            process.exit(1);
        }

        console.log(`📂 Reading file: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const lines = fileContent.split("\n").filter(line => line.trim());
        
        if (lines.length < 2) {
            console.error("❌ CSV file is empty or invalid");
            process.exit(1);
        }

        // Parse header row
        const headers = lines[0].split(",").map(h => h.trim());
        console.log(`📋 Headers: ${headers.join(", ")}`);

        // Parse data rows
        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.trim());
            if (values.length === headers.length) {
                const record = {};
                headers.forEach((header, index) => {
                    record[header] = values[index];
                });
                records.push(record);
            }
        }

        console.log(`📊 Total records to insert: ${records.length}`);

        // Clear existing data
        await Pincode.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Insert new data in batches
        const batchSize = 1000;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            await Pincode.insertMany(batch);
            console.log(`✅ Inserted ${Math.min(i + batchSize, records.length)}/${records.length} records`);
        }

        // Count final records
        const count = await Pincode.countDocuments();
        console.log(`\n🎉 Database seeded successfully! Total records: ${count}`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

seedDatabase();
