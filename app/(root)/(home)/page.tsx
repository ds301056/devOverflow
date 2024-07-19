import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'

const questions = [
  {
    _id: '1',
    title: 'Cascading Deletes in SQLAlchemy?',
    tags: [
      { _id: '1', name: 'python' },
      { _id: '2', name: 'sql' },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      picture: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    upvotes: 326556,
    views: 6323464,
    answers: [
      {
        _id: '1',
        content: 'Use the delete cascade option in your model definition.',
      },
    ],
    createdAt: new Date('2024-06-14T09:00:00.000Z'),
  },
  {
    _id: '2',
    title: 'How to use React Router?',
    tags: [
      { _id: '1', name: 'react' },
      { _id: '3', name: 'router' },
    ],
    author: {
      _id: '2',
      name: 'Jane Doe',
      picture: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    upvotes: 15546750,
    views: 25987600,
    answers: [
      {
        _id: '2',
        content: 'Use the `useHistory` hook to navigate programmatically.',
      },
    ],
    createdAt: new Date('2024-07-17T09:00:00.000Z'),
  },
]

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 hover:animate-shimmer hover:bg-[200-percent] hover:bg-orange-600 hover:bg-shimmer-gradient-light hover:shadow-lg dark:hover:animate-shimmer dark:hover:bg-[200-percent] dark:hover:bg-shimmer-gradient-dark">
            Ask Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to ask! 🚀 Ask a question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  )
}
