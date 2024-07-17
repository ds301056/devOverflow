import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'

const questions = [
  /*   {
    _id: 1,
    tittle: 'Cascading Deletes in SQLAlchemy?',
    tags: [
      { _id: 1, name: 'python' },
      { _id: 2, name: 'sql' },
    ],
    author: 'John Doe',
    upvotes: 10,
    views: 20,
    answers: 2,
    createdAt: '2024-06-14T09:00:00.000Z',
  },
  {
    _id: 2,
    tittle: 'How to use React Router?',
    tags: [
      { _id: 1, name: 'react' },
      { _id: 2, name: 'router' },
    ],
    author: 'Jane Doe',
    upvotes: 10,
    views: 20,
    answers: 2,
    createdAt: '2024-07-17T09:00:00.000Z',
  }, */
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

      <div className="mt-10 flex w-full flex-col">
        {questions.length > 0 ? (
          questions.map((question) => 'QuestionCard')
        ) : (
          <NoResult />
        )}
      </div>
    </>
  )
}
