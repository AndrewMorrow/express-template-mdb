import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// use to get relative path
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            // secure: true, // use for port 465 only
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD, // replace both with your real credentials
            },
        });

        // reads html from passed in template
        const source = fs.readFileSync(path.join(__dirname, template), "utf8");

        const compiledTemplate = handlebars.compile(source);
        // options for nodemailer sendMail()
        const options = () => {
            return {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // nodemailer Send email
        transporter.sendMail(options(), (error, info) => {
            if (error) {
                return error;
            } else {
                // return true if successful
                return res.status(200).json({
                    success: true,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

export default sendEmail;
