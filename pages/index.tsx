import React, { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";
import Nav from "../components/nav/Nav";
import { message, Spin } from "antd";
import style from './index.module.scss';
import sendRequest from "../utils/sendRequest";
import { IGeneralOperation, IPostList, IPostPreview } from "../dataStructures";
import PostList from "../components/PostList/PostList";
import { IOnFinishArgs } from "../components/Editor/Editor";
import dynamic from "next/dynamic";


export default function Home() {
  const { auth, setAuth } = useContext(UserAuthContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPostPreview[]>([]);
  const [currentEditId, setCurrentEditId] = useState<string>('');
  const [shouldEditorLoadData, setShouldEditorLoadData] = useState(false);
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

  async function handleFinishEditing({ title, description, content, tags }: IOnFinishArgs) {
    let result: IGeneralOperation | null;
    if (currentEditId === 'create') {
      result = await sendRequest<IGeneralOperation>({
        url: 'add_post',
        method: 'POST',
        body: { title, description, content, tags }
      });
    } else {
      result = await sendRequest<IGeneralOperation>({
        url: 'update_post',
        method: 'POST',
        body: { id: currentEditId, title, description, content, tags }
      });
    }
    if (result && result.success) {
      message.success('保存成功');
      setCurrentEditId('');
    }
    await loadData();
  }

  function handleCancelEditing() {
    setCurrentEditId('');
  }

  function handleEdit(id: string) {
    setShouldEditorLoadData(true);
    setCurrentEditId(id);
  }

  function handleCreateNewPost() {
    setCurrentEditId('create');
    setShouldEditorLoadData(false);
  }

  const SpinnerComponent =
    (
      <div
        style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' } }>
        <Spin tip={ '请稍后...' } size={ "large" }/>
      </div>
    );


  function EditorComponent() {
    if (currentEditId) {
      return (
        <div className={ style.editorPopup }>
          <div className={ style.container }>
            <Editor id={ currentEditId }
                    loadData={ shouldEditorLoadData }
                    onFinish={ handleFinishEditing }
                    onCancel={ handleCancelEditing }
            />
          </div>
        </div>
      );
    }
  }

  const MainComponent =
    (
      <div className={ style.indexRoot }>
        <div style={ { filter: currentEditId ? 'blur(2px)' : '' } }>
          <Nav/>
          <div>
            <PostList posts={ posts }
                      onUpdate={ handlePostListUpdate }
                      onEdit={ handleEdit }
                      onCreate={ handleCreateNewPost }/>
          </div>
        </div>
        { EditorComponent() }
      </div>
    );


  return (
    !auth.loggedIn || loading ? SpinnerComponent : MainComponent
  );
}
