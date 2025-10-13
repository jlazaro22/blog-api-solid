import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { GetAllUsersUseCase } from 'use-cases/user/get-all-users';

export function makeGetAllUsersUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const getAllUsersUseCase = new GetAllUsersUseCase(usersRepository);

  return getAllUsersUseCase;
}
