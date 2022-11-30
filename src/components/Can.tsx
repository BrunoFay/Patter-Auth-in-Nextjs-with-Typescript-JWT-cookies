import { ReactNode } from "react";
import { useUserCan } from "../hooks/useUserCan";

interface CanProps {
  children:ReactNode
  permissions?:string[]
  roles?: string[]
}

export function Can({children, permissions, roles}:CanProps){
  const userCanSeeComponent = useUserCan({ permissions, roles })

  if(!userCanSeeComponent){
    return null
  }

  return(
    <>
    {children}
    </>
  )
}