import Token from 'models/token';
import { Types } from 'mongoose';
import { ITokensRepository } from 'repositories/tokens-repository';

export class MongooseTokensRepository implements ITokensRepository {
  async create(token: string, userId: string): Promise<void> {
    await Token.create({ token, userId });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await Token.deleteMany({ userId });
  }
}
