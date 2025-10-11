import { MongooseTokensRepository } from 'repositories/mongoose/mongoose-tokens-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { LoginUseCase } from 'use-cases/auth/login';

export function makeLoginUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const tokensRepository = new MongooseTokensRepository();
  const loginUseCase = new LoginUseCase(usersRepository);

  return { loginUseCase, tokensRepository };
}
