import React, { useContext, useState } from "react";
import style from './login.module.scss';
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";
import { message } from "antd";
import sendReauest from "../utils/sendRequest";
import { ILoginResult } from "../dataStructures";
import md5 from "crypto-js/md5";

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(UserAuthContext);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);

    const data = await sendReauest<ILoginResult>({
      url: 'login', method: 'POST', body: {
        password: md5(password).toString()
      }
    });
    if (data) {
      if (data.success) {
        setAuth!({ loggedIn: true, token: data.token });
        message.success('登录成功');
        localStorage.token = data.token;
        router.push('/');
      } else {
        message.error('登录失败');
      }
    }
    setLoading(false);
  }

  return (
    <div className={ style.loginRoot }>
      <div className={ style.loginBox }>
        <h1>登录</h1>
        <input type="password"
               disabled={ loading }
               placeholder={ '密码' }
               value={ password }
               onChange={ (event) => setPassword(event.target.value) }
        />
        <button disabled={ loading } onClick={ handleLogin }>{ loading ? '登录中...' : '登录' }</button>
      </div>
    </div>
  );
}
