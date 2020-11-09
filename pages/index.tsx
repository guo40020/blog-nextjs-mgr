import React, { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";
import Nav from "../components/nav/Nav";
import { Spin } from "antd";
import style from './index.module.scss';
import sendRequest from "../utils/sendRequest";
import { IPostList, IPostPreview } from "../dataStructures";
import PostList from "../components/PostList/PostList";
import { IOnFinishArgs } from "../components/Editor/Editor";
import dynamic from "next/dynamic";

export default function Home() {
  const { auth, setAuth } = useContext(UserAuthContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPostPreview[]>([]);
  const [currentEditId, setCurrentEditId] = useState<string>('');
  const router = useRouter();

  const Editor = dynamic(() => import('../components/Editor/Editor'), { ssr: false });

  async function loadData() {
    const data = await sendRequest<IPostList>({
      url: 'get_posts',
      method: 'GET',
    });
    if (data) {
      setPosts(data.posts);
    }
    console.log(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!auth.loggedIn) {
      if (localStorage.token) {
        setAuth({ loggedIn: true, token: localStorage.token });
      } else {
        router.push('/login');
      }
    }
    console.log(auth.loggedIn);

    loadData();
  }, []);

  async function handlePostListUpdate() {
    await loadData();
  }

  function handleEdit(id: string) {
    setCurrentEditId(id);
  }

  function handleFinishEditing({ title, description, content, tags }: IOnFinishArgs) {

  }

  function SpinnerComponent() {
    return (
      <div
        style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' } }>
        <Spin tip={ '请稍后...' } size={ "large" }/>
      </div>
    );
  }

  function EditorComponent() {
    if (true) {
      return (
        <div>
          <div className={ style.editorMask }/>
          <Editor id={ currentEditId } onFinish={ handleFinishEditing }/>
        </div>
      );
    }
  }

  function MainComponent() {
    return (
      <div className={ style.indexRoot }>
        <Nav/>
        <div>
          <PostList posts={ posts } onUpdate={ handlePostListUpdate } onEdit={ handleEdit }/>
        </div>
        { EditorComponent() }
      </div>
    );
  }

  return (
    !auth.loggedIn || loading ? SpinnerComponent() : MainComponent()
  );
}
