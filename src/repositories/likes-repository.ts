import { ILike } from 'models/like';
import { Types } from 'mongoose';

export interface ILikesRepository {
  findOneByBlogIdAndUserId(
    blogId: string,
    userId: string,
  ): Promise<
    | (ILike & {
        _id: Types.ObjectId;
      })
    | null
  >;

  create(data: ILike): Promise<ILike>;

  delete(likeId: Types.ObjectId): Promise<void>;
}
