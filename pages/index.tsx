import { useContext, useEffect } from "react";
import { UserAuthContext } from "../contexts/UserAuthContext";
import { useRouter } from "next/router";

export default function Home() {
  const { auth } = useContext(UserAuthContext);
  const router = useRouter()

  useEffect(() => {
    if (!auth!.loggedIn) {
      router.push('/login')
    }
  }, [])

  return (
    <div/>
  )
}
