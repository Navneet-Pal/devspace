import { User } from "./model.js";
import { IUser } from "./types.js";

interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
  isVerified?: boolean;
  refreshToken?: string | null;
}

export class UserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(data: Partial<IUser>) {
    return User.create(data);
  }

  async findByRefreshToken(refreshToken: string) {
    return User.findOne({ refreshToken });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return User.findByIdAndUpdate(id, { refreshToken });
  }

  async findByEmailWithPassword(email: string) {
    return User.findOne({ email }).select("+password");
  }

  async updateVerificationStatus(userId: string, val: boolean) {
    return User.findByIdAndUpdate(userId, { isVerified: val }, { new: true });
  }

  async updatePassword(id: string, password: string) {
    return User.findByIdAndUpdate(
      id,
      {
        password,
        refreshToken: null,
      },
      { new: true },
    );
  }

  async updateAvatar(userId: string, avatar: string, avatarPublicId: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar,
          avatarPublicId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async searchUsers(query: string, excludeUserId?: string) {
    const search = query.trim();

    if (!search) {
      return [];
    }

    const filter: Record<string, unknown> = {
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    if (excludeUserId) {
      filter._id = {
        $ne: excludeUserId,
      };
    }

    return User.find(filter).select("_id name email avatar").limit(8).lean();
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

export const userRepository = new UserRepository();
