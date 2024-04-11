import express from "express";
import { users, addUser, getUserById } from "./db";
import { hashPass, comparePass } from "./auth";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing field" });
  }

  const hashedPass = await hashPass(password);
  addUser({
    id: users.length + 1,
    username,
    password: hashedPass,
  });

  res.status(201).json({ message: "User Created Successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing field" });
  }

  try {
    const user = getUserById(
      users.findIndex((user: { username: any }) => user.username === username)
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await comparePass(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
