const validation = {
  // Validate Register Info
  register: (data) => {
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
  },
  // Validate Login Info
  login: (data) => {
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
  },
  // Validate Update User Info
  userUpdate: (data) => {
    let errors = {};

    // checks email with regex
    if (data.email) {
      const emailTrim = data.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        errors.email = "Invalid Email";
      }
    }

    // checks password fields and length
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

    // checks length of errors object
    const isValid = Object.keys(errors).length === 0;

    // throw custom errors if any
    if (!isValid) {
      const err = new Error("Invalid Payload");
      err.statusCode = 422;
      err.errors = errors;
      throw err;
    }
  },
  // Validate ResetPassword Info
  resetPassword: (data) => {
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
  },
  // Validate Update Password Info
  updatePassword: (data) => {
    let errors = {};

    const currPassTrim = data.currPass.trim();
    const updPassTrim = data.updatedPass.trim();
    const updPass2Trim = data.updatedPass2.trim();

    // checks password fields and length
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

    // checks length of errors object
    const isValid = Object.keys(errors).length === 0;

    // throw custom errors if any
    if (!isValid) {
      const err = new Error("Invalid Payload");
      err.statusCode = 422;
      err.errors = errors;
      throw err;
    }
  },
};

export default validation;
