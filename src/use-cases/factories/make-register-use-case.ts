import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { RegisterUseCase } from 'use-cases/auth/register';

export function makeRegisterUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}
