/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password
 * @param password Password to validate
 * @returns Object with validation result and error message
 */
export const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }
  
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }
  
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }
  
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate a username
 * @param username Username to validate
 * @returns Object with validation result and error message
 */
export const validateUsername = (
  username: string
): { isValid: boolean; message: string } => {
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long',
    };
  }
  
  if (username.length > 20) {
    return {
      isValid: false,
      message: 'Username must be less than 20 characters long',
    };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, and underscores',
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate form fields
 * @param fields Object containing field values
 * @param rules Validation rules for each field
 * @returns Object containing validation errors
 */
export const validateForm = (
  fields: Record<string, any>,
  rules: Record<string, (value: any) => { isValid: boolean; message: string }>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([fieldName, validateFn]) => {
    if (fields[fieldName] !== undefined) {
      const { isValid, message } = validateFn(fields[fieldName]);
      if (!isValid) {
        errors[fieldName] = message;
      }
    }
  });
  
  return errors;
};