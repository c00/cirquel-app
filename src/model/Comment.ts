import { Author } from './Author';

export interface Comment {
  id: number;
  itemId: number;
  author: Author;
  text: string;
  created: number;
  edited: number;
  deleted: number;
  parentId?: number;

  commentCount: number;
  comments: Comment[];
  upvotes: number;
  myVote?: CommentVote;

  showComments: boolean;
}

export interface CommentVote {
  id: number;
  commentId: number;
  vote: number;
  date: number;
}