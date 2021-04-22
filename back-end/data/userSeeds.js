import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin ",
        lastName: "User",
        email: "admin@example.com",
        password: bcrypt.hashSync("12345678", 20),
        isAdmin: true,
    },
    {
        name: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: bcrypt.hashSync("12345678", 20),
    },
    {
        name: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: bcrypt.hashSync("12345678", 20),
    },
];

export default users;
