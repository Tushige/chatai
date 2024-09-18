import { getBotQuestionsByDomainId } from '@/actions/questions.action'
import { Separator } from '@/components/ui/separator'
import BotQuestionForm from '@/ui/domain/bot-questions/bot-question-form'
import BotQuestionList from '@/ui/domain/bot-questions/bot-question-list'
import React from 'react'

const NewQuestionPage = async ({
  params
}) => {
  const questions = await getBotQuestionsByDomainId(params.id)
  return (
    <div className="w-full h-full pl-2 md:pl-4">
      <div className="max-w-[42rem] pt-8">
        <h1 className="font-bold text-2xl mb-2">
          Bot Training Questions
        </h1>
        <p className="text-sm mb-8">Tailor your bot to ask the questions you want to ask from your customers</p>
        <BotQuestionForm domainId={params.id} />
        <Separator className="mt-4 mb-4"/>
        <div>
          <h2 className="mb-4">
            Your Questions
          </h2>
          <BotQuestionList questions={questions}/>
        </div>
      </div>
    </div>
  )
}

export default NewQuestionPage