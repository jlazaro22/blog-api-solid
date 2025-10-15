import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseCommentsRepository } from 'repositories/mongoose/mongoose-comments-repository';
import { MongooseUsersRepository } from 'repositories/mongoose/mongoose-users-repository';
import { DeleteCommentUseCase } from 'use-cases/comment/delete-comment';

export function makeDeleteCommentUseCase() {
  const usersRepository = new MongooseUsersRepository();
  const blogsRepository = new MongooseBlogsRepository();
  const commentsRepository = new MongooseCommentsRepository();

  const deleteCommentUseCase = new DeleteCommentUseCase(
    usersRepository,
    blogsRepository,
    commentsRepository,
  );

  return deleteCommentUseCase;
}
