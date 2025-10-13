import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseTokensRepository } from 'repositories/mongoose/mongoose-tokens-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { DeleteCurrentUserUseCase } from 'use-cases/user/delete-current-user';

export function makeDeleteCurrentUserUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const tokensRepository = new MongooseTokensRepository();
  const blogsRepository = new MongooseBlogsRepository();

  const deleteCurrentUserUseCase = new DeleteCurrentUserUseCase(
    usersRepository,
    blogsRepository,
    tokensRepository,
  );

  return deleteCurrentUserUseCase;
}
