import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { GetCurrentUserUseCase } from 'use-cases/user/get-current-user';

export function makeGetCurrentUserUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const getCurrentUserUseCase = new GetCurrentUserUseCase(usersRepository);

  return getCurrentUserUseCase;
}
