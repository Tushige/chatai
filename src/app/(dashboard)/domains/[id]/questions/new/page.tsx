import { getChatbotByDomainId } from '@/actions/chatbot.action';
import { getBotQuestionsByDomainId } from '@/actions/questions.action';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import { Separator } from '@/components/ui/separator';
import BotQuestionForm from '@/ui/domain/bot-questions/bot-question-form';
import BotQuestionList from '@/ui/domain/bot-questions/bot-question-list';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';

const NewQuestionPage = async ({ params }: {params: {id: string}}) => {
  const questions = await getBotQuestionsByDomainId(params.id);
  const bot = await getChatbotByDomainId(params.id);
  return (
    <div>
      <AppSectionHeroContainer>
        <Link href={`/domains/${params.id}`} className='mb-4 flex'>
          <ArrowLongLeftIcon className='size-6' />
          Back to Settings
        </Link>
        <h1 className='mb-2 text-2xl font-bold'>Bot Training Questions</h1>
        <p className='mb-8 text-sm text-text-secondary'>
          Tailor your bot to ask the questions you want to ask from your
          customers
        </p>
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <div className='max-w-[42rem]'>
          <BotQuestionForm domainId={params.id} chatBotKitId={bot.chatBotKitId} />
          <Separator className='my-4' />
          <div>
            <h2 className='mb-4 font-bold text-text-foreground'>
              Your Questions
            </h2>
            <BotQuestionList
              questions={questions}
              chatBotKitId={bot.chatBotKitId}
              domainId={params.id}
            />
          </div>
        </div>
      </AppSectionContainer>
    </div>
  );
};

export default NewQuestionPage;
