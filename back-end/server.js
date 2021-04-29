import dotenv from "dotenv";
import path from "path";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import compression from "compression";

// import mongo connection
import connectDB from "./config/db.js";

// Middleware packages
import passport from "passport";
import passConfig from "./config/passport.js";
import { notFound, errorHandler } from "./middleware/customErrorHandler.js";
import rateLimiterRedisMiddleware from "./middleware/rateLimiterRedis";

// Route Imports
import authRoutes from "./routes/auth.js";

// Initialize dotenv
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

// connect to mongoDB
connectDB();

// Initialize express
const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(logger("dev"));
app.use(rateLimiterRedisMiddleware);

// security package bundle
app.use(helmet);

// enable compression
app.use(compression({ filter: shouldCompress }));
// custom filter compression
function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}

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
