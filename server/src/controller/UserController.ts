import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from "../dto/UserDTO";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export class UserController {
  // Register a new user, create and return jwt token
  static async registerUser(
    req: Request<{}, {}, RegisterUserDTO>,
    res: Response<AuthResponseDTO | { message: string }>
  ) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        username,
        password: hashedPassword,
      });
      await userRepository.save(user);

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" }
      );
      return res
        .status(201)
        .json({ token, message: "User created successfully" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Authenticate user , create and return jwt token
  static async loginUser(
    req: Request<{}, {}, LoginUserDTO>,
    res: Response<AuthResponseDTO | { message: string }>
  ) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    try {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" }
      );

      return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
