'use client'
import AppSectionTitle from '@/components/app-section-title'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import React from 'react'

const DomainCodeIntegration = ({
  domain
}) => {
  const [copiedText, copyToClipBoard] = useCopyToClipboard()

  let snippet = `
    const iframe = document.createElement("iframe");
    
    const iframeStyles = (styleString) => {
      const style = document.createElement('style');
      style.textContent = styleString;
      document.head.append(style);
    }
    
    iframeStyles('
        .chat-frame {
            position: fixed;
            bottom: 50px;
            right: 50px;
            border: none;
        }
    ')
    
    iframe.src = "http://localhost:3000/chatbot"
    iframe.classList.add('chat-frame')
    document.body.appendChild(iframe)
    
    window.addEventListener("message", (e) => {
        if(e.origin !== "http://localhost:3000") return null
        let dimensions = JSON.parse(e.data)
        iframe.width = dimensions.width
        iframe.height = dimensions.height
        iframe.contentWindow.postMessage("${domain.id}", "http://localhost:3000/")
    })
  `
  return (
    <div className="container">
      <AppSectionTitle
        title="Integrate Chatbot"
        description="Please copy/paste the following code snippet into the header tag of your application."
      />
      <Separator className="mb-2"/>
      <div className="bg-background rounded-md inline-block p-2 relative mb-8 max-w-[100%]">
        <Button 
          className="bg-background text-text rounded-full absolute right-[15px] top-[15px] hover:bg-muted"
          onClick={() => copyToClipBoard(snippet)}
        >
          <DocumentDuplicateIcon className="w-6" />
        </Button>
        <pre className="overflow-x-scroll">
          <code>
            {snippet}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default DomainCodeIntegration