import z from 'zod';

export const registerBodySchema = z.object({
  email: z
    .email('Invalid email address')
    .trim()
    .max(50, 'Email must be less than 50 characters long'),
  password: z
    .string('Password is required.')
    .min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['admin', 'user'], 'Role must be either "admin" or "user"'),
});

export const loginBodySchema = z.object({
  email: z
    .email('Invalid email address')
    .trim()
    .max(50, 'Email must be less than 50 characters long'),
  password: z
    .string('Password is required.')
    .min(8, 'Password must be at least 8 characters long'),
});
