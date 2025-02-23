import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { users, User } from "../models/user";

const SECRET_KEY = "";

export const register = (req: any, res: any) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ error: "User already exists" });
  }
  const newUser: User = { id: uuidv4(), username, password };
  users.push(newUser);
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.status(201).json({ token });
};

export const login = (req: any, res: any) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
};
