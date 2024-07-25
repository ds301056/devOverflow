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
  {
    _id: '3',
    title: 'Understanding Promises in JavaScript',
    tags: [
      { _id: '4', name: 'javascript' },
      { _id: '5', name: 'promises' },
    ],
    author: {
      _id: '3',
      name: 'Alice Smith',
      picture: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    upvotes: 845620,
    views: 1432650,
    answers: [
      {
        _id: '3',
        content:
          'A promise represents the eventual result of an asynchronous operation.',
      },
    ],
    createdAt: new Date('2024-05-23T09:00:00.000Z'),
  },
  {
    _id: '4',
    title: 'Difference Between var, let, and const in JavaScript',
    tags: [
      { _id: '4', name: 'javascript' },
      { _id: '6', name: 'variables' },
    ],
    author: {
      _id: '4',
      name: 'Bob Johnson',
      picture: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    upvotes: 2345567,
    views: 5423650,
    answers: [
      {
        _id: '4',
        content: 'var is function-scoped, let and const are block-scoped.',
      },
    ],
    createdAt: new Date('2024-04-18T09:00:00.000Z'),
  },
  {
    _id: '5',
    title: 'How to Manage State in React?',
    tags: [
      { _id: '1', name: 'react' },
      { _id: '7', name: 'state-management' },
    ],
    author: {
      _id: '5',
      name: 'Charlie Brown',
      picture: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    upvotes: 194750,
    views: 254376,
    answers: [
      {
        _id: '5',
        content: 'Use the useState and useReducer hooks for state management.',
      },
    ],
    createdAt: new Date('2024-07-01T09:00:00.000Z'),
  },
  {
    _id: '6',
    title: 'What is Dependency Injection in Angular?',
    tags: [
      { _id: '8', name: 'angular' },
      { _id: '9', name: 'dependency-injection' },
    ],
    author: {
      _id: '6',
      name: 'Daisy Miller',
      picture: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    upvotes: 457832,
    views: 897654,
    answers: [
      {
        _id: '6',
        content:
          'Dependency Injection is a design pattern used to implement IoC.',
      },
    ],
    createdAt: new Date('2024-06-11T09:00:00.000Z'),
  },
  {
    _id: '7',
    title: 'How to Implement Dark Mode in CSS?',
    tags: [
      { _id: '10', name: 'css' },
      { _id: '11', name: 'dark-mode' },
    ],
    author: {
      _id: '7',
      name: 'Emily Davis',
      picture: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
    upvotes: 562321,
    views: 1032456,
    answers: [
      {
        _id: '7',
        content:
          'Use the prefers-color-scheme media query to implement dark mode.',
      },
    ],
    createdAt: new Date('2024-07-05T09:00:00.000Z'),
  },
  {
    _id: '8',
    title: 'How to Optimize Performance in a React App?',
    tags: [
      { _id: '1', name: 'react' },
      { _id: '12', name: 'performance' },
    ],
    author: {
      _id: '8',
      name: 'Frank White',
      picture: 'https://randomuser.me/api/portraits/men/8.jpg',
    },
    upvotes: 738291,
    views: 1325648,
    answers: [
      {
        _id: '8',
        content: 'Use memoization and code-splitting to optimize performance.',
      },
    ],
    createdAt: new Date('2024-06-29T09:00:00.000Z'),
  },
  {
    _id: '9',
    title: 'What is the Difference Between HTTP and HTTPS?',
    tags: [
      { _id: '13', name: 'http' },
      { _id: '14', name: 'https' },
    ],
    author: {
      _id: '9',
      name: 'Grace Lee',
      picture: 'https://randomuser.me/api/portraits/women/9.jpg',
    },
    upvotes: 879654,
    views: 1987543,
    answers: [
      {
        _id: '9',
        content: 'HTTPS is HTTP with encryption and secure identification.',
      },
    ],
    createdAt: new Date('2024-07-03T09:00:00.000Z'),
  },
  {
    _id: '10',
    title: 'How to Handle Forms in React?',
    tags: [
      { _id: '1', name: 'react' },
      { _id: '15', name: 'forms' },
    ],
    author: {
      _id: '10',
      name: 'Henry Clark',
      picture: 'https://randomuser.me/api/portraits/men/10.jpg',
    },
    upvotes: 672390,
    views: 1234509,
    answers: [
      {
        _id: '10',
        content: 'Use controlled components to handle forms in React.',
      },
    ],
    createdAt: new Date('2024-06-21T09:00:00.000Z'),
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
