import jwt from "jsonwebtoken";
import { randstr } from "./randstr";

const SECRET_KEY = import.meta.env.JWT_SECRET;
const randId = randstr();

export function generateToken() {
  return jwt.sign({ id: randId }, SECRET_KEY, {
    expiresIn: "15m",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY!);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function generateAuthToken(email: string, role: string) {
  const payload = {
    id: randId,
    email: email,
    role: role,
  };
  return jwt.sign({ payload: payload }, SECRET_KEY, {
    expiresIn: "60m",
  });
}
