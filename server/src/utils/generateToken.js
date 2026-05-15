import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, config.jwtRefreshSecret, {
    expiresIn: "7d",
  });
};
