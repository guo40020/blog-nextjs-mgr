import { useContext, useEffect } from "react";
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";
import Nav from "../components/nav/Nav";

export default function Home() {
  const { auth, setAuth } = useContext(UserAuthContext);
  const router = useRouter()

  useEffect(() => {
    if (!auth.loggedIn) {
      if (localStorage.token) {
        setAuth({loggedIn: true, token: localStorage.token})
      }
      router.push('/login')
    }
  }, [])

  return (
    <div>
      <Nav/>
    </div>
  )
}
