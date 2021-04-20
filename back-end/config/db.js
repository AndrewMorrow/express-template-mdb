import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // connect to mongoDB
        const conn = await mongoose.connect(
            process.env.MONGODB_URI ||
                `mongodb://localhost:27017/${process.env.MONGODB_DATABASE}`,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // exit with failure
        process.exit(1);
    }
};

export default connectDB;
