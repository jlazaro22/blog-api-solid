import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseCommentsRepository } from 'repositories/mongoose/mongoose-comments-repository';
import { GetBlogCommentsUseCase } from 'use-cases/comment/get-blog-comments';

export function makeGetBlogCommentsUseCase() {
  const commentsRepository = new MongooseCommentsRepository();
  const blogsRepository = new MongooseBlogsRepository();

  const getBlogCommentsUseCase = new GetBlogCommentsUseCase(
    commentsRepository,
    blogsRepository,
  );

  return getBlogCommentsUseCase;
}
