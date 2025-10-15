import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { CreateBlogUseCase } from 'use-cases/blog/create-blog';

export function makeCreateBlogUseCase() {
  const blogsRepository = new MongooseBlogsRepository();
  const createBlogUseCase = new CreateBlogUseCase(blogsRepository);

  return createBlogUseCase;
}
