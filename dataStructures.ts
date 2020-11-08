export interface ILoginResult {
  success: boolean;
  token: string;
}

export interface IPostList {
  posts: IPostPreview[]
}

export interface IPostPreview {
  title: string;
  dateTime: number;
  description: string;
  tags: string;
  id: string;
}

export interface IPostDetail {
  content: string;
  title: string;
  description: string;
  tags: string;
}
