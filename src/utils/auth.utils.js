import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
};
