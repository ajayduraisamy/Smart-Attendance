// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 8;
};

// Employee ID validation
export const validateEmpId = (empId) => {
  return empId.length >= 3 && empId.length <= 20;
};

// Form input validation
export const validateInput = (name, value) => {
  switch (name) {
    case 'email':
      return validateEmail(value) ? '' : 'Invalid email address';
    case 'password':
      return validatePassword(value) ? '' : 'Password must be at least 8 characters';
    case 'name':
      return value.trim().length >= 2 ? '' : 'Name must be at least 2 characters';
    case 'empId':
      return validateEmpId(value) ? '' : 'Employee ID must be 3-20 characters';
    default:
      return value.trim() ? '' : 'This field is required';
  }
};
