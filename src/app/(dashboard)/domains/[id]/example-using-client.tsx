'use client'
import {getDomain} from '@/actions/domain'
import Loader from '@/components/loader'
import { Separator } from '@/components/ui/separator'
import { AuthContext } from '@/context/use-auth-context'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const DomainSettingsPage = ({params}) => {
  const {toast} = useToast()
  const router = useRouter()
  const domainId = params.id
  if (!domainId) {
    router.push('/')
  }
  const {authId, loading: authLoading} = useContext(AuthContext)
  const [domain, setDomain] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const domainRecord = await getDomain(params.id)  
        setDomain(domainRecord)
        setLoading(false)
      } catch (err) {
        toast({
          title: 'Error',
          description: 'oops'
        })
      } finally {
        setLoading(false)
      }
    }
    if (!authLoading) {
      fetchUser()
    }
  }, [authLoading])
  if (authLoading) {
    return <Loader />
  }
  if (!authId) {
    return router.push('/')
  }
  if (loading) {
    <Loader />
  }
  return (
    <div>
      <div>
        <h2>
         {/* {domain.name} */}
        </h2>
        <p>
          Modify domain and chatbox settings
        </p>
      </div>
      <div>
        <h2>
          Domain Settings
        </h2>
        <Separator />
        
      </div>
    </div>
  )
}

export default DomainSettingsPage