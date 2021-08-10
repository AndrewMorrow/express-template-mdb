import dotenv from "dotenv";
import path from "path";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

// import mongo connection
import connectDB from "./config/db.js";

// Middleware packages
import passport from "passport";
import passConfig from "./config/passport.js";
import { notFound, errorHandler } from "./middleware/customErrorHandler.js";

// Route Imports
import authRoutes from "./routes/auth.routes.js";

// Initialize dotenv
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// connect to mongoDB
connectDB();

// Initialize express
const app = express();

const PORT = process.env.PORT || 5000;

// setup limiter for ip address
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// middleware
app.use(express.json()); //Parse JSON
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
// morgan logger setup
app.use(logger("dev"));
//  apply rate limit all requests
app.use(limiter);

// security package bundle
app.use(helmet());

// enable compression
app.use(compression({ filter: shouldCompress }));
// custom filter for compression
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
