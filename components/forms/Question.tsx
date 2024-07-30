'use client' // Indicates that this file is using client-side rendering.

import React, { useRef, useState } from 'react' // Importing necessary hooks from React.
import { Editor } from '@tinymce/tinymce-react' // Importing the TinyMCE React editor component.
import { zodResolver } from '@hookform/resolvers/zod' // Importing Zod resolver for react-hook-form validation.
import * as z from 'zod' // Importing Zod for schema validation.
import { useForm } from 'react-hook-form' // Importing the useForm hook from react-hook-form.
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form' // Importing custom form components.
import { Input } from '@/components/ui/input' // Importing a custom input component.
import { Button } from '../ui/button' // Importing a custom button component.
import { QuestionsSchema } from '@/lib/validations' // Importing the validation schema for the form.
import { Badge } from '../ui/badge' // Importing a custom badge component.
import Image from 'next/image' // Importing the Next.js image component.
import { createQuestion } from '@/lib/actions/question.action' // Importing the createQuestion API action.
import { useRouter, usePathname } from 'next/navigation' // Importing hooks for routing and pathname.

const type: any = 'create' // Define a variable to distinguish between creating and editing questions.

interface Props {
  mongoUserId: string // Define the Props interface to include the mongoUserId.
}

const Question = ({ mongoUserId }: Props) => {
  const editorRef = useRef(null) // Create a ref for the TinyMCE editor.
  const [isSubmitting, setIsSubmitting] = useState(false) // Create a state to manage form submission status.
  const router = useRouter() // Get the router instance for navigation.
  const pathname = usePathname() // Get the current pathname.

  // 1. Define your form using useForm with zodResolver and QuestionsSchema.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  })

  // 2. Define a submit handler to handle form submission.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true) // Set the isSubmitting state to true to indicate submission.

    try {
      // Make an async call to create a question with the form data.
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      })

      // Navigate to the home page after successful submission.
      router.push('/')
    } catch (error) {
      // Handle any errors that occur during submission.
    } finally {
      setIsSubmitting(false) // Reset the isSubmitting state after submission.
    }
  }

  // Handle key down event for the input field, specifically for adding tags.
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any,
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault() // Prevent the default behavior of the Enter key.

      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim() // Get the trimmed value of the input field.

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          // Set an error if the tag length exceeds 15 characters.
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.',
          })
        }

        if (!field.value.includes(tagValue as never)) {
          // Add the tag to the form value if it doesn't already exist.
          form.setValue('tags', [...field.value, tagValue])
          tagInput.value = '' // Clear the input field.
          form.clearErrors('tags') // Clear any existing errors for tags.
        }
      } else {
        form.trigger() // Trigger validation if the input value is empty.
      }
    }
  }

  // Handle tag removal when a tag is clicked.
  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag) // Filter out the tag to be removed.

    form.setValue('tags', newTags) // Update the form value with the new list of tags.
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        {/* Field for the question title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* Field for the detailed explanation */}
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{' '}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor // Set the editor instance to the ref.
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)} // Update the form value when editor content changes.
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                    ],
                    toolbar:
                      'undo redo | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter |' +
                      'alignright alignjustify | bullist numlist',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* Field for the tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)} // Handle key down event to add tags.
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() => handleTagRemove(tag, field)} // Handle tag removal on click.
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="Close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* Submit button */}
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting} // Disable the button while submitting.
        >
          {isSubmitting ? (
            <>{type === 'edit' ? 'Editing...' : 'Posting...'}</>
          ) : (
            <>{type === 'edit' ? 'Edit Question' : 'Ask a Question'}</>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default Question // Export the Question component.
