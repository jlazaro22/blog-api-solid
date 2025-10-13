import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseTokensRepository } from 'repositories/mongoose/mongoose-tokens-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { DeleteUserByIdUseCase } from 'use-cases/user/delete-user-by-id';

export function makeDeleteUserByIdUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const tokensRepository = new MongooseTokensRepository();
  const blogsRepository = new MongooseBlogsRepository();

  const deleteUserByIdUseCase = new DeleteUserByIdUseCase(
    usersRepository,
    blogsRepository,
    tokensRepository,
  );

  return deleteUserByIdUseCase;
}
