import { Separator } from '@/components/ui/separator'
import React from 'react'

const DomainSettingsPage = ({params}) => {
  // TODO - fetch domain doc from the db
  return (
    <div>
      <div>
        <h2>
          Domain Name
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