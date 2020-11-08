import Link from "next/link";
import React, { useContext } from "react";
import style from './Nav.module.scss'
import { UserAuthContext } from "../../contexts/UserAuthContext";
import { useRouter } from "next/router";

export default function Nav() {
  const { setAuth } = useContext(UserAuthContext);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    setAuth({loggedIn: false, token: ''});
    router.push('/login');
  }

  return (
    <nav className={ style.navBar }>
      <Link href={ '/' }>
        <a>
          <div className={ style.left }>
            <img
              src="https://avatars3.githubusercontent.com/u/19303341?s=460&u=b4b50f08dda14b1d90d98597310c00c531ba192c&v=4"
              alt="avatar"/>
            <p className={ style.name }>Kelly</p>
            <p className={ style.smallText }>无聊的消遣地</p>
          </div>
        </a>
      </Link>
      <a className={ style.right } href={'#'} onClick={handleLogout}>
        <p>退出登录</p>
      </a>
    </nav>
  )
}
