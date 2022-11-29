import { createContext, ReactNode, useState } from "react";
import { Api } from "../libs/axios";

type AuthSignIn = {
   email:string
   password:string
}

type AuthContext={
  signIn:(session:AuthSignIn)=>Promise<void>
  isAuthenticated:boolean
}

export const AuthContext = createContext({} as AuthContext)

export function AuthProvider({children}:{children:ReactNode}){
  const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false)


 async function signIn({email,password}:AuthSignIn){
    console.log({email,password})
    try {
      const response = await Api.post('sessions',{email,password})
      console.log(response.data);

    } catch (error) {
      console.log(error)
    }
  }

  const valueToProvide={signIn,isAuthenticated}

  return (
          <AuthContext.Provider value={valueToProvide}>
            {children}
          </AuthContext.Provider>
         )
}