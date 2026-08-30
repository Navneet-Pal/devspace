import { ApiError } from "../../utils/ApiError.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import { UserRepository } from "../user/respository.js";

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

import { deleteImage, uploadImage } from "../../utils/upload.js";

interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export class AuthService {
  private userRespository = new UserRepository();

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

    const verificationLink = `${env.CLIENT_URL}/email-verified?token=${verifyToken}`;

    const html = `
      <h2>Welcome to DevSpace 🚀</h2>

      <p>
        Please verify your email by clicking the link below.
      </p>

      <a href="${verificationLink}">
        Verify Email
      </a>
    `;

    await sendEmail(user.email, "Verify your email", html);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };
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

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.userRespository.updateRefreshToken(userId, null);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh Token is required");
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await this.userRespository.findByRefreshToken(refreshToken);

    if (!user || user._id.toString() !== payload.userId) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateAccessToken(user._id.toString());

    return {
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    };
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await this.userRespository.findByEmail(data.email);

    if (!user) {
      return;
    }

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

      <p>
        Click below to reset your password.
      </p>

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

    if (verificationToken.expiresAt < new Date()) {
      throw new ApiError(400, "Reset Password token has expired");
    }

    const user = await this.userRespository.findById(
      verificationToken.userId.toString(),
    );

    if (!user) {
      throw new ApiError(404, "User Not Found");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.userRespository.updatePassword(
      user._id.toString(),
      hashedPassword,
    );

    await this.verificationRespository.deleteByToken(data.token);
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await this.userRespository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const name = data.name?.trim();

    const email = data.email?.trim().toLowerCase();

    const nameChanged = name !== undefined && name !== user.name;

    const emailChanged = email !== undefined && email !== user.email;

    if (!nameChanged && !emailChanged) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      };
    }

    /*
     * Email changes require a new
     * email verification.
     */
    if (emailChanged) {
      const existingUser = await this.userRespository.findByEmail(email!);

      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ApiError(409, "A user with this email already exists.");
      }

      const updatedUser = await this.userRespository.updateProfile(userId, {
        ...(nameChanged && {
          name,
        }),
        email,
        isVerified: false,
        refreshToken: null,
      });

      if (!updatedUser) {
        throw new ApiError(404, "User not found.");
      }

      await this.verificationRespository.deleteByUserIdAndType(
        userId,
        TOKEN_TYPE.VERIFY_EMAIL,
      );

      const verifyToken = uuidv4();

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await this.verificationRespository.create(
        userId,
        verifyToken,
        expiresAt,
        TOKEN_TYPE.VERIFY_EMAIL,
      );

      const verificationLink = `${env.CLIENT_URL}/email-verified?token=${verifyToken}`;

      const html = `
        <h2>Verify your new DevSpace email</h2>

        <p>
          Your DevSpace email address has been changed.
          Please verify your new email address.
        </p>

        <a href="${verificationLink}">
          Verify Email
        </a>
      `;

      await sendEmail(email!, "Verify your new email", html);

      return {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isVerified: updatedUser.isVerified,
      };
    }

    /*
     * Name-only update.
     */
    const updatedUser = await this.userRespository.updateProfile(userId, {
      name,
    });

    if (!updatedUser) {
      throw new ApiError(404, "User not found.");
    }

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isVerified: updatedUser.isVerified,
    };
  }

  async searchUsers(query: string, excludeUserId?: string) {
    return this.userRespository.searchUsers(query, excludeUserId);
  }

  async updateAvatar(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new ApiError(400, "Profile image is required.");
    }

    const allowedMimeTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);

    if (!allowedMimeTypes.has(file.mimetype)) {
      throw new ApiError(
        400,
        "Only JPEG, PNG, WEBP, and GIF images are allowed.",
      );
    }

    const user = await this.userRespository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const folder = "devspace/users/avatars";

    let uploaded: Awaited<ReturnType<typeof uploadImage>> | null = null;

    try {
      /*
       * Upload the new avatar first.
       * This prevents us from losing the old
       * avatar if the new upload fails.
       */
      uploaded = await uploadImage(file, folder);

      const updatedUser = await this.userRespository.updateAvatar(
        userId,
        uploaded.secure_url,
        uploaded.public_id,
      );

      if (!updatedUser) {
        await deleteImage(uploaded.public_id);

        throw new ApiError(404, "User not found.");
      }

      /*
       * Delete the old Cloudinary image only
       * after the database has been updated.
       */
      if (user.avatarPublicId) {
        try {
          await deleteImage(user.avatarPublicId);
        } catch {
          /*
           * Do not fail the successful avatar
           * update because old-image cleanup failed.
           *
           * The old image can be cleaned up separately.
           */
        }
      }

      return {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isVerified: updatedUser.isVerified,
      };
    } catch (error) {
      /*
       * If the database update failed after the
       * Cloudinary upload, remove the newly uploaded
       * image so we don't leave an orphaned asset.
       */
      if (uploaded?.public_id) {
        try {
          await deleteImage(uploaded.public_id);
        } catch {
          // Ignore cleanup failure.
        }
      }

      throw error;
    }
  }
}
