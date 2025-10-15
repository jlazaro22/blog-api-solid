import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseCommentsRepository } from 'repositories/mongoose/mongoose-comments-repository';
import { CommentBlogUseCase } from 'use-cases/comment/comment-blog';

export function makeCommentBlogUseCase() {
  const blogsRepository = new MongooseBlogsRepository();
  const commentsRepository = new MongooseCommentsRepository();

  const commentBlogUseCase = new CommentBlogUseCase(
    commentsRepository,
    blogsRepository,
  );

  return commentBlogUseCase;
}
