import { createContext, ReactNode, useState } from "react";

type AuthSignIn = {
   email:string
   password:string
}

type AuthContext={
  signIn:(session:AuthSignIn)=>Promise<void>
  isAuthenticated:boolean
  t:any
}

export const AuthContext = createContext({} as AuthContext)

export function AuthProvider({children}:{children:ReactNode}){
  const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false)

  function t(){
    console.log('testee')
  }
 async function signIn({email,password}:AuthSignIn){
    console.log({email,password})
  }

  const valueToProvide={signIn,isAuthenticated,t}

  return (
          <AuthContext.Provider value={valueToProvide}>
            {children}
          </AuthContext.Provider>
         )
}