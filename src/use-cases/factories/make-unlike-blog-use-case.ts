import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseLikesRepository } from 'repositories/mongoose/mongoose-likes-repository';
import { UnlikeBlogUseCase } from 'use-cases/like/unlike-blog';

export function makeUnlikeBlogUseCase() {
  const blogsRepository = new MongooseBlogsRepository();
  const likesRepository = new MongooseLikesRepository();

  const unlikeBlogUseCase = new UnlikeBlogUseCase(
    blogsRepository,
    likesRepository,
  );

  return unlikeBlogUseCase;
}
