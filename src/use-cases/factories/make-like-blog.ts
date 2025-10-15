import { MongooseBlogsRepository } from 'repositories/mongoose/mongoose-blogs-repository';
import { MongooseLikesRepository } from 'repositories/mongoose/mongoose-likes-repository';
import { LikeBlogUseCase } from 'use-cases/like/like-blog';

export function makeLikeBlogUseCase() {
  const blogsRepository = new MongooseBlogsRepository();
  const likesRepository = new MongooseLikesRepository();

  const likeBlogUseCase = new LikeBlogUseCase(blogsRepository, likesRepository);

  return likeBlogUseCase;
}
