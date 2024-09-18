'use client'
import { deleteBotQuestion } from '@/actions/questions.action'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Questions } from '@prisma/client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React from 'react'

type Props = {
  questions: Questions[]
}
const BotQuestionList = ({
  questions
}: Props) => {
  const {toast} = useToast()
  const deleteQuestion = async (questionId: string) => {
    try {
      await deleteBotQuestion(questionId)
      toast({
        title: 'Success',
        description: 'The question has been deleted'
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong.'
      })
    }
  }
  return (
    <div>
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
                        onClick={() => deleteQuestion(question.id)}
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
    </div>
  )
}


export default BotQuestionList