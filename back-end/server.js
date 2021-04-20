const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
// const session = require("express-session");

const PORT = process.env.PORT || 5000;

const app = express();

// session
// if (app.get("env") === "production") {
//     app.set("trust proxy", 1); // trust first proxy
//     sess.cookie.secure = true; // serve secure cookies
// }
// const sess = {
//     secret: "Some String Here",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true, maxAge: 3600000 },
// };

// app.use(session(sess));

// middleware
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

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
