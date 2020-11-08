import { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";
import Nav from "../components/nav/Nav";
import { Spin } from "antd";
import style from './index.module.scss';
import sendRequest from "../utils/sendRequest";
import { IPostList, IPostPreview } from "../dataStructures";
import PostList from "../components/PostList/PostList";

export default function Home() {
  const { auth, setAuth } = useContext(UserAuthContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPostPreview[]>([]);
  const router = useRouter();

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

  function spinner() {
    return (
      <div
        style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' } }>
        <Spin tip={ '请稍后...' } size={ "large" }/>
      </div>
    );
  }

  function main() {
    return (
      <div className={ style.indexRoot }>
        <Nav/>
        <div>
          <PostList posts={ posts }/>
        </div>
      </div>
    );
  }

  return (
    <div>
      { !auth.loggedIn || loading ? spinner() : main() }
    </div>
  );
}
