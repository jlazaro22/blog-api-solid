import Like, { ILike } from 'models/like';
import { Types } from 'mongoose';
import { ILikesRepository } from 'repositories/likes-repository';

export class MongooseLikesRepository implements ILikesRepository {
  async findOneByBlogIdAndUserId(
    blogId: string,
    userId: string,
  ): Promise<
    | (ILike & {
        _id: Types.ObjectId;
      })
    | null
  > {
    const like = await Like.findOne({ blogId, userId }).lean().exec();

    return like;
  }

  async create(data: ILike): Promise<ILike> {
    const userId = new Types.ObjectId(data.userId);
    const blogId = new Types.ObjectId(data.blogId);

    const like = await Like.create({
      userId,
      blogId,
    });

    return like;
  }

  async delete(likeId: Types.ObjectId): Promise<void> {
    await Like.deleteOne({ _id: likeId });
  }
}
