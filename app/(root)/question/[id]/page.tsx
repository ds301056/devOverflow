import Answer from '@/components/forms/Answer'
import Metric from '@/components/shared/Metric'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import { getQuestionById } from '@/lib/actions/question.action'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/lib/actions/user.action'
import AllAnswers from '@/components/shared/AllAnswers'
import Votes from '@/components/shared/Votes'

const page = async ({ params, searchParams }: any) => {
  // Get the user id from the Clerk session
  const { userId: clerkId } = auth()

  let mongoUser = null // Initialize with null

  if (clerkId) {
    try {
      mongoUser = await getUserById({ userId: clerkId })
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const result = await getQuestionById({ questionId: params.id })

  // Add null checks for result and result.author
  if (!result || !result.author) {
    return <p>Question or author not found</p>
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture || '/default-profile.png'} // Fallback image
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name || 'Anonymous'} {/* Fallback name */}
            </p>
          </Link>
          <div className="flex justify-end">
            {/* Only show voting for authenticated users */}
            {mongoUser && (
              <Votes
                type="Question"
                itemId={result._id ? JSON.stringify(result._id) : ''}
                userId={mongoUser ? JSON.stringify(mongoUser._id) : ''}
                upvotes={result.upvotes.length}
                hasupVoted={
                  mongoUser ? result.upvotes.includes(mongoUser._id) : false
                }
                downvotes={result.downvotes.length}
                hasdownVoted={
                  mongoUser ? result.downvotes.includes(mongoUser._id) : false
                }
                hasSaved={mongoUser?.saved?.includes(result._id)}
              />
            )}
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id || tag.name} // Fallback key if tag._id is missing
            _id={tag._id || 'unknown'} // Safe check for tag._id
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      {/* Render answers for everyone */}
      <AllAnswers
        questionId={result._id}
        userId={mongoUser?._id} // Safe access to mongoUser
        totalAnswers={result.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      {/* Only render answer form for authenticated users */}
      {mongoUser && (
        <Answer
          question={result.content}
          questionId={JSON.stringify(result._id)}
          authorId={JSON.stringify(mongoUser._id)} // Safe access
        />
      )}

      {/* Optionally display message for unauthenticated users */}
      {!mongoUser && (
        <div className="w-full justify-center p-6">
          <p className="paragraph-semibold text-dark300_light700 text-primary-500 dark:text-primary-500">
            You must sign in to submit an answer or vote.
          </p>
        </div>
      )}
    </>
  )
}

export default page
