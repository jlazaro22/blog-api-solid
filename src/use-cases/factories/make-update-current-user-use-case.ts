import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { UpdateCurrentUserUseCase } from 'use-cases/user/update-current-user';

export function makeUpdateCurrentUserUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const updateCurrentUserUseCase = new UpdateCurrentUserUseCase(
    usersRepository,
  );

  return updateCurrentUserUseCase;
}
