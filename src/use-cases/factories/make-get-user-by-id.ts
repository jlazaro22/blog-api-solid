import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { GetUserByIdUseCase } from 'use-cases/user/get-user-by-id';

export function makeGetUserByIdUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository);

  return getUserByIdUseCase;
}
