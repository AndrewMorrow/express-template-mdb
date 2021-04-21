import dotenv from "dotenv";
import path from "path";
import express from "express";
import connectDB from "./config/db.js";
// Middleware packages
import passport from "passport";
import passConfig from "./config/passport.js";
// Routes
import authRoutes from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// connect to mongoDB
connectDB();

const app = express();

// middleware
app.use(express.json());

// Passport JWT setup
app.use(passport.initialize());
// app.use(passport.session());
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

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
