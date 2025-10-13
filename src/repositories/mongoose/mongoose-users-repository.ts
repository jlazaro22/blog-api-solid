import { Document, Types } from 'mongoose';

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

  async findById(
    userId: string,
    useLean: boolean = true,
    select?: string,
  ): Promise<
    | (Document<unknown, {}, IUser, {}, {}> &
        IUser & {
          _id: Types.ObjectId;
        } & {
          __v: number;
        })
    | null
  > {
    const id = new Types.ObjectId(userId);
    const query = User.findOne(id).select(select || '-__v');

    if (useLean) query.lean();

    const user = await query.exec();

    return user;
  }

  async count(): Promise<number> {
    const count = await User.countDocuments();

    return count;
  }

  async findAll(limit: number, offset: number): Promise<IUser[] | null> {
    const users = await User.find()
      .limit(limit)
      .skip(offset)
      .select('-__v')
      .lean()
      .exec();

    return users;
  }

  async create(data: IUser): Promise<IUser> {
    const user = await User.create(data);

    return user;
  }

  async delete(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
}
