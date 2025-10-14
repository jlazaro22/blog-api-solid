import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { GetBlogsByAuthorUseCase } from 'use-cases/blog/get-blogs-by-author';

export function makeGetBlogsByAuthorUseCase() {
  const blogsRepository = new MongooseBlogsRepository();
  const usersRepository = new MongooseUsersRepository();

  const getBlogsByAuthorUseCase = new GetBlogsByAuthorUseCase(
    usersRepository,
    blogsRepository,
  );

  return getBlogsByAuthorUseCase;
}
