const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL,{
            useUnifiedTopology: true
        });
        console.log("connected to ", conn.connection.host)
    } catch (error) {
        console.log("Database connectivity error: ", error.message)
        process.exit();
    }
}

module.exports = {connectDb}