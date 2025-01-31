// lib/auth.js
import bcrypt from 'bcryptjs';

const storedPasswordHash = process.env.PASSWORD_HASH;  // Stored password hash in environment variable (for production)

export function isAuthenticated(req) {
  // Extract password from the user request
  const { password } = req.body;  // Assume password is sent in the body

  // Check if the password matches the stored hashed password
  if (!password) {
    return false;  // Password is missing
  }

  // Compare the password with the stored hash
  const isPasswordValid = bcrypt.compareSync(password, storedPasswordHash); 

  return isPasswordValid; // Return true if the password matches
}
