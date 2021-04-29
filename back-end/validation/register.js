// Validate Register Info
export default function validateRegisterInput(data) {
    let errors = {};
    data.firstName.trim();
    data.lastName.trim();
    data.email.trim();
    data.password.trim();
    data.password2.trim();

    if (!data.firstName) {
        errors.firstName = "First name field is required";
    }

    if (!data.lastName) {
        errors.lastName = "Last name field is required";
    }

    if (!data.email) {
        errors.email = "Email field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Invalid Email";
    }

    if (!data.password) {
        errors.password = "Password field is required";
    } else if (!data.password2) {
        errors.password2 = "Please re-enter your password";
    } else if (data.password.length < 8 || data.password.length > 20) {
        errors.password = "Password must be between 8 and 20 characters";
    } else if (data.password !== data.password2) {
        errors.password = "Passwords do not match";
    }

    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
        const err = new Error("Invalid Payload");
        err.statusCode = 422;
        err.errors = errors;
        throw err;
    }
}
