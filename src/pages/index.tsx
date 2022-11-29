
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Home() {
  const { signIn,isAuthenticated } = useContext(AuthContext)
  const [email,setEmail ] = useState('')
  const [password,setPassword ] = useState('')

 async function handlesSession(e:FormEvent){
    e.preventDefault()
    const data = {email,password}
    await signIn(data)

  }
  return (
    <form onSubmit={handlesSession} className='' style={{display:'flex',justifyContent:'center', flexDirection:'column',alignItems:'center',margin: '10% 0px 0px 0px'}}>
      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <button type='submit'> login </button>
    </form>
  )
}
