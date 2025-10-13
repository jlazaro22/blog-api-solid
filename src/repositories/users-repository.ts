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

  findById(
    userId: string,
    useLean?: boolean,
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

  count(): Promise<number>;

  findAll(limit?: number, offset?: number): Promise<IUser[] | null>;

  create(user: IUser): Promise<IUser>;

  delete(userId: string): Promise<void>;
}
