import { model, Schema, Types } from 'mongoose';

export interface IComment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>({
  blogId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [1000, 'Content must be less than 1000 characters long'],
  },
});

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
