import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { GetAllBlogsUseCase } from 'use-cases/blog/get-all-blogs';

export function makeGetAllBlogsUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const blogsRepository = new MongooseBlogsRepository();
  const getAllBlogsUseCase = new GetAllBlogsUseCase(
    usersRepository,
    blogsRepository,
  );

  return getAllBlogsUseCase;
}
