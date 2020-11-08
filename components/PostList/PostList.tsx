import React from "react";
import style from "./PostList.module.scss";
import { IPostList } from "../../dataStructures";
import ArticleCard from "../ArticleCard";

export default function PostList({ posts }: IPostList) {
  const postAvailable = posts.length > 0;
  return (
    <div className={ style.postListRoot } style={ { justifyContent: postAvailable ? 'initial' : 'center' } }>
      {
        postAvailable ?
          posts.map((v, i) => {
            return <ArticleCard key={ i } title={ v.title } description={ v.description }/>;
          })
          :
          <p>空空如也</p>
      }
    </div>
  );
}
