import React, { useContext, useState } from "react";
import style from './login.module.scss'
import { API_ROOT } from "../constants";
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {setAuth} = useContext(UserAuthContext);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await fetch(`${ API_ROOT }/login`)
      const data = await res.json()
      if (data.success) {
        setAuth!({loggedIn: true, displayName: data.displayName, token: data.token})
        router.push('/')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={style.loginRoot}>
      <div className={style.loginBox}>
        <h1>登录</h1>
        <input type="text"
               placeholder={'用户名'}
               value={username}
               onChange={(event) => setUsername(event.target.value)}
        />
        <input type="password"
               placeholder={'密码'}
               value={password}
               onChange={(event) => setPassword(event.target.value)}
        />
        <button disabled={loading} onClick={handleLogin}>{loading ? '登录中...' : '登录'}</button>
      </div>
    </div>
  )
}
