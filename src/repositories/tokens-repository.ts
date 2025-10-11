import { Types } from 'mongoose';

export interface ITokensRepository {
  create(token: string, userId: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
