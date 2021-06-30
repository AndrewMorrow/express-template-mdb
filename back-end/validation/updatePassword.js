// Validate Register Info
export default function validatePassUpdateInput(data) {
    let errors = {};

    const currPassTrim = data.currPass.trim();
    const updPassTrim = data.updatedPass.trim();
    const updPass2Trim = data.updatedPass2.trim();

    if (!currPassTrim) {
        errors.password = "Please enter your current password";
    } else if (!updPassTrim) {
        errors.password = "Password field is required";
    } else if (!updPass2Trim) {
        errors.password = "Please re-enter your password";
    } else if (updPassTrim.length < 8 || updPassTrim.length > 20) {
        errors.password = "Password must be between 8 and 20 characters";
    } else if (updPassTrim !== updPass2Trim) {
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
