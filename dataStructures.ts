export interface IGeneralOperation {
  success: boolean;
  message?: string;
}

export interface ILoginResult extends IGeneralOperation {
  token: string;
}

export interface IPostList extends IGeneralOperation {
  posts: IPostPreview[]
}

export interface IPostPreview extends IGeneralOperation {
  title: string;
  dateTime: number;
  description: string;
  tags: string;
  id: string;
}

export interface IPostDetail extends IGeneralOperation {
  content: string;
  title: string;
  description: string;
  tags: string;
}

export interface IUploadFile extends IGeneralOperation {
  url: string;
}
