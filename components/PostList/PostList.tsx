import React from "react";
import style from "./PostList.module.scss";
import { IPostPreview } from "../../dataStructures";
import ArticleCard from "../ArticleCard";
import sendRequest from "../../utils/sendRequest";

interface IPostListProps {
  posts: IPostPreview[];
  onUpdate: () => Promise<void>;
}

export default function PostList({ posts, onUpdate }: IPostListProps) {
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
        postAvailable ?
          posts.map((v, i) => {
            return <ArticleCard key={ i }
                                onDelete={ handleArticleDelete }
                                postId={ v.id }
                                title={ v.title }
                                description={ v.description }
            />;
          })
          :
          <p>空空如也</p>
      }
    </div>
  );
}
