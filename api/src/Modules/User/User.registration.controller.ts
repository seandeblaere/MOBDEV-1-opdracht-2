import { Request, Response, NextFunction } from "express";
import UserModel from "./User.model";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const newUser = new UserModel({ email, password, name });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    next(error);
  }
};

export { registerUser };
