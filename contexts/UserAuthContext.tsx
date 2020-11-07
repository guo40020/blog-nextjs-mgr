import React, { ComponentProps, createContext, Dispatch, useState } from "react";

interface IUserAuth {
  loggedIn: boolean;
  token: string;
  displayName: string;
}

interface IUserAuthContextValues {
  auth?: IUserAuth;
  setAuth?: Dispatch<IUserAuth>;
}

export const UserAuthContext = createContext<IUserAuthContextValues>({});

export default function UserAuthContextProvider(props: ComponentProps<any>) {
  const [auth, setAuth] = useState<IUserAuth>({loggedIn: false,token: '', displayName: ''})

  return (
    <UserAuthContext.Provider value={{auth, setAuth}}>
      {props.children}
    </UserAuthContext.Provider>
  )
}
