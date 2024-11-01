'use client';
import AppSectionTitle from '@/components/app-section-title';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const DomainCodeIntegration = ({ domain }) => {
  const [, copyToClipBoard] = useCopyToClipboard();

  const javascriptSnippet = `
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
    
    iframe.src = "${process.env.NEXT_PUBLIC_CHATBOT_URL}/${domain.id}"
    iframe.classList.add('chat-frame')
    document.body.appendChild(iframe)
    
    window.addEventListener("message", (e) => {
        if(e.origin !== "${process.env.NEXT_PUBLIC_ORIGIN}") return null
        let dimensions = JSON.parse(e.data)
        iframe.width = dimensions.width
        iframe.height = dimensions.height
        iframe.contentWindow.postMessage("${domain.id}", "${process.env.NEXT_PUBLIC_ORIGIN}")
    })
  `;
  const reactSnippet = `
    import { useEffect } from 'react';
    
    const ChatIframe = () => {
      useEffect(() => {
        const iframe = document.createElement('iframe');
        const style = document.createElement('style');
        const domainId = "2c0aa5d4-80bc-448c-a056-09717ddb4a5d";
        
        style.textContent = \`
          .chat-frame {
            position: fixed;
            bottom: 50px;
            right: 50px;
            border: none;
            width: 400px; /* Set a default width */
            height: 600px; /* Set a default height */
            z-index: 1000; /* Ensure it appears on top */
          }
        \`;
    
        iframe.src = \`http://localhost:3000/chatbot/\${domainId}\`;
        iframe.className = "chat-frame";
    
        document.head.appendChild(style);
        document.body.appendChild(iframe);
    
        window.addEventListener("message", (e) => {
          if (e.origin !== "http://localhost:3000") return;
          let dimensions = JSON.parse(e.data);
          iframe.width = dimensions.width;
          iframe.height = dimensions.height;
        });
    
        return () => {
          document.body.removeChild(iframe);
          document.head.removeChild(style);
          window.removeEventListener("message", () => {});
        };
      }, []);
    
      return null;
    };
    
    export default ChatIframe;
  `;
  return (
    <div className='container w-full'>
      <AppSectionTitle
        title='Integrate Chatbot'
        description='Please copy/paste the following code snippet into the header tag of your application.'
      />
      <Separator className='my-2' />

      <Tabs defaultValue="react" className="mb-6 sm:mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="javascript">Javascript</TabsTrigger>
        </TabsList>

        <TabsContent value="react" className="w-full">
          <Card>
            <CardContent className="relative space-y-2">
              <Button
                className='absolute right-[15px] top-[15px] rounded-full bg-background text-text hover:bg-muted'
                onClick={() => copyToClipBoard(reactSnippet)}
              >
                <DocumentDuplicateIcon className='w-6' />
              </Button>
              <pre className='overflow-x-scroll hide-scroll'>
                <code className="text-sm">{reactSnippet}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="javascript" className="w-full">
          <Card>
            <CardContent className="relative space-y-2">
              <Button
                className='absolute right-[15px] top-[15px] rounded-full bg-background text-text hover:bg-muted'
                onClick={() => copyToClipBoard(javascriptSnippet)}
              >
                <DocumentDuplicateIcon className='w-6' />
              </Button>
              <pre className='overflow-x-scroll hide-scroll'>
                <code className="text-sm">{javascriptSnippet}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainCodeIntegration;
