import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { UserRespository } from "../user/respository.js";
import { LoginInput, RegisterInput } from "./validation.js";
import bcrypt from "bcrypt";
import { env } from "node:process";

export class AuthService {
  private userRespository = new UserRespository();

  async register(data: RegisterInput) {
    const existingUser = await this.userRespository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRespository.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  async login(data: LoginInput) {
    const user = await this.userRespository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid Password");
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    await this.userRespository.updateRefreshToken(
      user._id.toString(),
      refreshToken,
    );
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }
}
