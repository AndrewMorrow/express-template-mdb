import dotenv from "dotenv";
import users from "./data/user.seeds.js";
import User from "./models/User.model.js";
import connectDB from "./config/db.js";

dotenv.config();

// connect to mongoDB
connectDB();

// seed data into db
const importData = async () => {
  try {
    await User.deleteMany();
    console.log("Data Started");
    await User.insertMany(users);

    console.log("Data Imported");
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

// destroy data in db
const destroyData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed");
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

// setup -d flag to destroy data
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
