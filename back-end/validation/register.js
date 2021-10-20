// Validate Register Info
export default function validateRegisterInput(data) {
  let errors = {};
  const firstTrim = data?.firstName?.trim();
  const lastTrim = data?.lastName?.trim();
  const emailTrim = data?.email?.trim();
  const passTrim = data?.password?.trim();
  const pass2Trim = data?.password2?.trim();

  // check first name
  if (!firstTrim) {
    errors.firstName = "First name field is required";
  }

  // check second name
  if (!lastTrim) {
    errors.lastName = "Last name field is required";
  }

  // checks email with regex
  if (!emailTrim) {
    errors.email = "Email field is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
    errors.email = "Invalid Email";
  }

  // checks password fields & length
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
