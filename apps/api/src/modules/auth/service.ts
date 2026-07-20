import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { UserRespository } from "../user/respository.js";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  resetPasswordInput,
} from "./validation.js";
import bcrypt from "bcrypt";
import { VerificationRepository } from "../verification/respository.js";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../lib/mail.js";
import { env } from "../../config/env.js";
import { TOKEN_TYPE } from "../../constants/token.js";

export class AuthService {
  private userRespository = new UserRespository();
  private verificationRespository = new VerificationRepository();

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

    await this.verificationRespository.deleteByUserIdAndType(
      user._id.toString(),
      TOKEN_TYPE.VERIFY_EMAIL,
    );

    const verifyToken = uuidv4();

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.verificationRespository.create(
      user._id.toString(),
      verifyToken,
      expiresAt,
      TOKEN_TYPE.VERIFY_EMAIL,
    );

    const verificationLink = `${env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    const html = ` <h2>Welcome to DevSpace 🚀</h2>

        <p>Please verify your email by clicking the link below.</p>

        <a href="${verificationLink}">
            Verify Email
        </a>`;

    await sendEmail(user.email, "Verify your email", html);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };

    return userResponse;
  }

  async login(data: LoginInput) {
    const user = await this.userRespository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email first");
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

  async logout(userId: string) {
    await this.userRespository.updateRefreshToken(userId, null);
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await this.userRespository.findByEmail(data.email);

    if (!user) return;

    await this.verificationRespository.deleteByUserIdAndType(
      user._id.toString(),
      TOKEN_TYPE.RESET_PASSWORD,
    );

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.verificationRespository.create(
      user._id.toString(),
      resetToken,
      expiresAt,
      TOKEN_TYPE.RESET_PASSWORD,
    );

    const resetLink = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
      <h2>Reset your password</h2>

      <p>Click below to reset your password.</p>

      <a href="${resetLink}">
      Reset Password
      </a>
      `;

    await sendEmail(user.email, "Reset your Password", html);
  }

  async resetPassword(data: resetPasswordInput) {
    const verificationToken = await this.verificationRespository.findByToken(
      data.token,
    );
    if (!verificationToken) {
      throw new ApiError(400, "Invalid reset password token");
    }

    if (verificationToken.type !== TOKEN_TYPE.RESET_PASSWORD) {
      throw new ApiError(400, "Invalid reset password token");
    }

    if(verificationToken.expiresAt < new Date()){
      throw new ApiError(400,"Reset Password token has expired");
    }

    const user = await this.userRespository.findById(verificationToken.userId.toString());

    if(!user){
      throw new ApiError(404,"User Not Found");
    }

    const hashedPassword = await bcrypt.hash(data.password,10);

    await this.userRespository.updatePassword(
      user._id.toString(),
      hashedPassword,
    )

    await this.verificationRespository.deleteByToken(data.token);

  }
}
