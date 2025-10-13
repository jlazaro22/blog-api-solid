import { IBlog } from 'models/blog';
import { Document, Types } from 'mongoose';

export interface IBlogsRepository {
  findAllByUserId(
    userId: string,
    useLean?: boolean,
    select?: string,
  ): Promise<
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
