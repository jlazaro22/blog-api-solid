import { IUser } from 'models/user';
import { Document, Types } from 'mongoose';

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

  findByUserId(
    userId: string,
    asLean?: boolean,
    select?: string,
  ): Promise<
    | (Document<unknown, {}, IUser, {}, {}> &
        IUser & {
          _id: Types.ObjectId;
        } & {
          __v: number;
        })
    | null
  >;

  create(user: IUser): Promise<IUser>;
}
