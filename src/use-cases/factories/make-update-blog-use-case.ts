import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { UpdateBlogUseCase } from 'use-cases/blog/update-blog';

export function makeUpdateBlogUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const blogsRepository = new MongooseBlogsRepository();
  const updateBlogUseCase = new UpdateBlogUseCase(
    usersRepository,
    blogsRepository,
  );

  return updateBlogUseCase;
}
