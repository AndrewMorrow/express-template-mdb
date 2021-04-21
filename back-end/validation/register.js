export default function validateRegisterInput(data) {
    let errors = {};

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
        errors.password = "Please re-enter your password";
    } else if (data.password.length < 8 || data.password.length > 20) {
        errors.password = "Password must be between 8 and 20 characters";
    } else if (data.password !== data.password2) {
        errors.password = "Passwords do not match";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
}
