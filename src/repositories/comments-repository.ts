import { IComment } from 'models/comment';

export interface ICommentsRepository {
  create(data: IComment): Promise<IComment>;
}
