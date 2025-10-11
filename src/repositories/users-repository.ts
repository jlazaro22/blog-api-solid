import { IUser } from 'models/user';
import { Types } from 'mongoose';

export interface IUsersRepository {
  checkEmailExists(email: string): Promise<{ _id: Types.ObjectId } | null>;

  checkUsernameExists(
    username: string,
  ): Promise<{ _id: Types.ObjectId } | null>;

  findOneByEmail(email: string): Promise<
    | (IUser & {
        _id: Types.ObjectId;
      })
    | null
  >;

  create(user: IUser): Promise<IUser>;
}
