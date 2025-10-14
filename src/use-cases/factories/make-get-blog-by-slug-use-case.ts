import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { GetBlogBySlugUseCase } from 'use-cases/blog/get-blog-by-slug';

export function makeGetBlogBySlugUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const blogsRepository = new MongooseBlogsRepository();

  const getBlogBySlugUseCase = new GetBlogBySlugUseCase(
    usersRepository,
    blogsRepository,
  );

  return getBlogBySlugUseCase;
}
