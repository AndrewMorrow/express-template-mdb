import dotenv from "dotenv";
import path from "path";
import express from "express";
import logger from "morgan";

// import mongo connection
import connectDB from "./config/db.js";

// Middleware packages
import passport from "passport";
import passConfig from "./config/passport.js";
import { notFound, errorHandler } from "./middleware/customErrorHandler.js";

// Route Imports
import authRoutes from "./routes/auth.js";

// Initialize dotenv
dotenv.config();

// connect to mongoDB
connectDB();

// Initialize express
const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(logger("dev"));

// Passport JWT setup
app.use(passport.initialize());
passConfig(passport);

// Middleware to use when routes require authenticated user.
const requiresAuth = passport.authenticate("jwt", { session: false });

// Routes
authRoutes(app);

// For production, serve compiled React app in client build directory.
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

// Custom Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
