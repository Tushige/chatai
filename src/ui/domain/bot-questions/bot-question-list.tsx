'use client'
import { deleteBotQuestion } from '@/actions/questions.action'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Questions } from '@prisma/client'
import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import Loader from '@/components/loader'
import { updateChatbotBackstory } from '@/actions/chatbot.action'

type Props = {
  questions: Questions[],
  chatBotKitId: string,
  domainId: string
}
const BotQuestionList = ({
  questions,
  chatBotKitId,
  domainId
}: Props) => {
const {toast} = useToast()
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteQuestionId, setDeleteQuestionId] = useState<string>('')
  const deleteQuestion = async () => {
    if (!deleteQuestionId) {
      console.error("this shouldn't happen. id was not found")
      toast({
        title: 'Error',
        description: "Something went wrong."
      })
      return
    }
    try {
      setLoading(true)
      const updatedQuestions = await deleteBotQuestion(deleteQuestionId, domainId)
      await updateChatbotBackstory(chatBotKitId, updatedQuestions)
      toast({
        title: 'Success',
        description: 'The question has been deleted'
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Something went wrong.'
      })
    } finally {
      setDeleteDrawerOpen(false)
      setLoading(false)
    }
  }
  return (
    <Drawer open={deleteDrawerOpen}>
      {
        questions && questions.length > 0 ? (
          <ul>
            {
              questions.map((question: Questions) => (
                <div
                  key={question.id}
                  className="flex flex-col p-4 bg-background rounded-lg hover:bg-surface"
                >
                  <p className="text-text">
                    {question.question}
                  </p>
                  <Button
                    className="bg-transparent hover:bg-transparent w-fit shadow-none text-red-600 p-0 m-0"
                    onClick={() => {
                      setDeleteQuestionId(question.id)
                      setDeleteDrawerOpen(true)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))
            }
          </ul>
        ) : (
          <p>You have no questions</p>
        )
      }
      <DrawerContent className="pb-12">
        <ConfirmationDrawerContent 
          loading={loading}
          deleteQuestion={deleteQuestion}
          setDeleteDrawerOpen={setDeleteDrawerOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

function ConfirmationDrawerContent({loading, deleteQuestion, setDeleteDrawerOpen}: {
  loading: boolean,
  deleteQuestion: () => void,
  setDeleteDrawerOpen: (val: boolean) => void
}) {
  return (
    <div className="mx-auto w-full max-w-sm">
    {
      loading && (
        <div className="py-12">
          <Loader className="size-[50px]"/>
        </div>
      )
    }
    {
      !loading && (
        <DrawerHeader>
          <DrawerTitle className="text-text-foreground">
            Are you sure you want to delete this question?
          </DrawerTitle>
          <DrawerDescription className="text-text">
            This action will permanently delete this question and cannot be reversed.
          </DrawerDescription>
          <div className="flex justify-between items-end gap-2">
            <Button
              type="button"
              onClick={() => setDeleteDrawerOpen(false)}
              className="bg-transparent text-text border-none shadow-none hover:bg-transparent "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full mt-4 bg-background text-error rounded-md flex flex-row gap-2 flex-start hover:bg-surface"
              onClick={deleteQuestion}  
            >
              Delete
            </Button>
          </div>
        </DrawerHeader>
      )
    }
  </div>
  )
}

export default BotQuestionList