import '../styles/globals.css'
import UserAuthContextProvider from "../contexts/UserAuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserAuthContextProvider>
      <Component {...pageProps} />
    </UserAuthContextProvider>
  )
}

export default MyApp
