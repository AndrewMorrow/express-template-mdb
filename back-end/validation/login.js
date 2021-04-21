export default function validateLoginInput(data) {
    let errors = {};

    if (!data.email) {
        errors.email = "Email field is required";
    }

    if (!data.password) {
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
}
