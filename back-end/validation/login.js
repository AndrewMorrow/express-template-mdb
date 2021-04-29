// Validate Login Info
export default function validateLoginInput(data) {
    let errors = {};
    data.email.trim();
    data.password.trim();

    if (!data.email) {
        errors.email = "Email field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Invalid Email";
    }

    if (!data.password) {
        errors.password = "Password field is required";
    }

    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
        const err = new Error("Invalid Payload");
        err.statusCode = 422;
        err.errors = errors;
        throw err;
    }
}
