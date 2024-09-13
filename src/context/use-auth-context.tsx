
'use client'
import { getAuthId } from "@/actions/auth"
import { createContext, useEffect, useState } from "react"

type AuthContextProps = {
  authId: string,
  loading: boolean
}
const AuthContext = createContext<AuthContextProps | null>(null)

const AuthProvider = ({children}: {
  children: React.ReactNode
}) => {
  const [authId, setAuthId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      const userId = await getAuthId()
      setAuthId(userId)
      setLoading(false)
    }
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{authId, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthProvider,
  AuthContext
}