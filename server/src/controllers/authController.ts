import jwt from "jsonwebtoken";

const SECRET_KEY = "";

const users = [{ id: "1", username: "testuser", password: "testpass" }];

export const login = (req: any, res: any) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
