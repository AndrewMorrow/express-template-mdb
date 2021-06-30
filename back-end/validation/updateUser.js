// Validate Register Info
export default function validateUserUpdateInput(data) {
  let errors = {};

  if(data.email){
    const emailTrim = data.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      errors.email = "Invalid Email";
    }
  }


  if (data.password) {
    const passTrim = data.password.trim();
    const pass2Trim = data.password2.trim();
    if (passTrim.length < 8 || passTrim.length > 20) {
      errors.password = "Password must be between 8 and 20 characters";
    } 
    if (!pass2Trim) {
      errors.password2 = "Please re-enter your password";
    } else if (pass2Trim.length < 8 || pass2Trim.length > 20) {
      errors.password = "Password must be between 8 and 20 characters";
    } else if (passTrim !== pass2Trim) {
      errors.password2 = "Passwords do not match";
    }
  }

  const isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    const err = new Error("Invalid Payload");
    err.statusCode = 422;
    err.errors = errors;
    throw err;
  }
}
