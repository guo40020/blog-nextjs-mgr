import React from "react";
import style from "./PostList.module.scss";
import { IPostPreview } from "../../dataStructures";
import ArticleCard from "../ArticleCard";
import sendRequest from "../../utils/sendRequest";
import { PlusOutlined } from "@ant-design/icons";

interface IPostListProps {
  posts: IPostPreview[];
  onUpdate: () => Promise<void>;
  onEdit: (id: string) => void;
}

export default function PostList({ posts, onUpdate, onEdit }: IPostListProps) {
  const postAvailable = posts.length > 0;

  async function handleArticleDelete(id: string) {
    await sendRequest({
      url: 'delete_post',
      method: "POST",
      body: {
        id
      }
    });
    await onUpdate();
  }

  return (
    <div className={ style.postListRoot } style={ { justifyContent: postAvailable ? 'initial' : 'center' } }>
      {
        posts.map((v, i) => {
          return <ArticleCard key={ i }
                              onDelete={ handleArticleDelete }
                              postId={ v.id }
                              title={ v.title }
                              description={ v.description }
                              onEdit={ onEdit }
          />;
        })
      }
      <div className={ style.addPost }>
        <PlusOutlined/>
      </div>
    </div>
  );
}
