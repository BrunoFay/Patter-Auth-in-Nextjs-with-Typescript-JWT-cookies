import { createContext, ReactNode, useEffect, useState } from "react";
import {destroyCookie, parseCookies, setCookie} from 'nookies'
import Router from "next/router";
import { Api } from "../libs/axiosClient";

type AuthSignIn = {
   email:string
   password:string
}

type User = {
  email:string
  permissions:string[]
  roles:string[]
}

type AuthContext={
  user:User
  signIn:(session:AuthSignIn)=>Promise<void>
  isAuthenticated:boolean
}

const authChannel = new BroadcastChannel('auth')
export const AuthContext = createContext({} as AuthContext)

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  authChannel.postMessage('SignOut')

  Router.push('/')
}

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User>()
  const isAuthenticated = !!user

  const {'nextauth.token':token} = parseCookies()

  useEffect(()=>{
    authChannel.onmessage=(message)=>{
      switch (message.data) {
        case 'SignOut':
          signOut()
          break;

        default:
          break;
      }
    }
  },[])

  useEffect(()=>{
    if(token){
      Api.get('/me').then(res=>{
        const {email,permissions,roles} = res.data
        setUser({email,permissions,roles})
      })
    }
  },[])

 async function signIn({email,password}:AuthSignIn){
    console.log({email,password})

    try {

      const response = await Api.post('sessions',{email,password})
      const {
        token,
        refreshToken,
        permissions,
        roles
       } = response.data

      setCookie(undefined,'nextauth.token',token,{
        maxAge: 60*60*24*30 , // 30 days
        path:'/'
      })

      setCookie(undefined,'nextauth.refreshtoken',refreshToken,{
        maxAge: 60*60*24*30 , // 30 days
        path:'/'
      })

      setUser({
        email,
        permissions,
        roles
       })

      Api.defaults.headers['Authorization']= `Bearer ${token}`

      Router.push('/dashboard')
    } catch (error) {
      signOut()
    }
  }

  const valueToProvide={signIn,isAuthenticated,user}

  return (
          <AuthContext.Provider value={valueToProvide}>
            {children}
          </AuthContext.Provider>
         )
}