// Validate Register Info
export default function validateUpdateInput(data) {
    let errors = {};

    data.currPass.trim();
    data.updatedPass.trim();
    data.updatedPass2.trim();

    if (!data.currPass) {
        errors.password = "Please enter your current password";
    } else if (!data.updatedPass) {
        errors.password = "Password field is required";
    } else if (!data.updatedPass2) {
        errors.password = "Please re-enter your password";
    } else if (data.updatedPass.length < 8 || data.updatedPass.length > 20) {
        errors.password = "Password must be between 8 and 20 characters";
    } else if (data.updatedPass !== data.updatedPass2) {
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
