
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { validateUserPermissions } from "../helpers/validateUserPermissions"

type UserCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useUserCan ( { permissions = [], roles = [] }: UserCanParams ) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if ( !isAuthenticated ) {
    return false
  }

  const useHasValidPermissions = validateUserPermissions( {
    user,
    permissions,
    roles
  } )

  return useHasValidPermissions

}
