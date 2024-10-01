'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const MembershipChangePlan = ({ }) => {
  console.log('Membership Change plan - this is params')
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const sessionId = searchParams.get('session_id')
  // TODO - upon successful purchase, we need to save stripe client id in our DB so that later the same customer can change their plans
  // do we save this client id from within a webhook?
  if (success === 'true') {
    return (
      <div>Plan Changed Successfully</div>
    )
  } else {
    return (
      <div>Something went wrong.</div>
    )
  }
}

export default MembershipChangePlan