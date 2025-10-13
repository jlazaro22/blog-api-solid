import { IBlog } from 'models/blog';
import { Document, Types } from 'mongoose';

export interface IBlogsRepository {
  findByUserId(userId: string): Promise<
    | (Document<unknown, {}, IBlog, {}, {}> &
        IBlog & {
          _id: Types.ObjectId;
        } & {
          __v: number;
        })[]
    | null
  >;

  deleteAllByUserId(userId: string): Promise<void>;
}
