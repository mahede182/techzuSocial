const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const isValidEmail = (email: string): boolean =>
    EMAIL_REGEX.test(email.trim());

export const isValidPassword = (password: string): boolean =>
    password.length >= MIN_PASSWORD_LENGTH;

export const validateLoginForm = (email: string, password: string): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!isValidEmail(email)) return 'Enter a valid email address';
    if (!password) return 'Password is required';
    if (!isValidPassword(password)) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    return null;
};

export const validateRegisterForm = (name: string, email: string, password: string): string | null => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!isValidEmail(email)) return 'Enter a valid email address';
    if (!password) return 'Password is required';
    if (!isValidPassword(password)) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    return null;
};
