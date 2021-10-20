// Validate ResetPassword Info
export default function validateResetPassInput(data) {
  let errors = {};
  const passTrim = data.password.trim();
  const pass2Trim = data.password2.trim();

  // checks password fields and length
  if (!passTrim) {
    errors.password = "Password field is required";
  } else if (!pass2Trim) {
    errors.password2 = "Please re-enter your password";
  } else if (passTrim.length < 8 || passTrim.length > 20) {
    errors.password = "Password must be between 8 and 20 characters";
  } else if (passTrim !== pass2Trim) {
    errors.password2 = "Passwords do not match";
  }

  // checks length of errors object
  const isValid = Object.keys(errors).length === 0;

  // throw custom errors if any
  if (!isValid) {
    const err = new Error("Invalid Payload");
    err.statusCode = 422;
    err.errors = errors;
    throw err;
  }
}
