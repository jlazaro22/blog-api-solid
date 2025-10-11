import { Types } from 'mongoose';

import User, { IUser } from 'models/user';
import { IUsersRepository } from 'repositories/users-repository';

export class MongooseUsersRepository implements IUsersRepository {
  async checkEmailExists(
    email: string,
  ): Promise<{ _id: Types.ObjectId } | null> {
    const emailExists = await User.exists({ email });

    return emailExists;
  }
  async checkUsernameExists(
    username: string,
  ): Promise<{ _id: Types.ObjectId } | null> {
    const usernameExists = await User.exists({ username });

    return usernameExists;
  }

  async findOneByEmail(email: string): Promise<
    | (IUser & {
        _id: Types.ObjectId;
      })
    | null
  > {
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    return user;
  }

  async create(data: IUser): Promise<IUser> {
    const user = await User.create(data);

    return user;
  }
}
