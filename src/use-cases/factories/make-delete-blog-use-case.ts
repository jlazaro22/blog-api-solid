import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { DeleteBlogUseCase } from 'use-cases/blog/delete-blog';

export function makeDeleteBlogUseCase_() {
  const usersRepository = new MongooseUsersRepository();
  const blogsRepository = new MongooseBlogsRepository();

  const deleteBlogUseCase = new DeleteBlogUseCase(
    usersRepository,
    blogsRepository,
  );

  return deleteBlogUseCase;
}
