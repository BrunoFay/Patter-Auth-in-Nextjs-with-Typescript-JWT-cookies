import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Api } from '../libs/axios'

export default function Dashboard() {
  const {user}= useContext(AuthContext)
  useEffect(()=>{
    Api.get('/me').then(res=>console.log(res.data))
  },[])
  return (
    <div>dashboard: {user?.email}</div>
  )
}
