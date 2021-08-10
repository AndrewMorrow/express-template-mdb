// Validate Login Info
export default function validateLoginInput(data) {
  let errors = {};

  // check email with regex
  if (!data.email.trim()) {
    errors.email = "Email field is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Invalid Email";
  }

  // check password length
  if (!data.password.trim()) {
    errors.password = "Password field is required";
  } else if (
    data.password.trim().length < 8 ||
    data.password.trim().length > 20
  ) {
    errors.password = "Password must be between 8 and 20 characters";
  }

  // Checks length of error object
  const isValid = Object.keys(errors).length === 0;

  // throw custom errors if any
  if (!isValid) {
    const err = new Error("Invalid Payload");
    err.statusCode = 422;
    err.errors = errors;
    throw err;
  }
}
