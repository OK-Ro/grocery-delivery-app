import jwt from "jsonwebtoken";

// Generate a JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET, // Use the secret from environment variables
    { expiresIn: "1h" } // Token expiry
  );
};

// Verify a JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
