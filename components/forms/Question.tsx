'use client'
import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '../ui/button'
import { QuestionsSchema } from '@/lib/validations'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import Image from 'next/image'

const type: any = 'create'

const Question = () => {
  const editorRef = useRef(null) // 3. Create a ref for the editor
  const [isSubmitting, setIsSubmitting] = useState(false) // 4. Create a state to handle submitting

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true) // don allow submit button to be hit multiple times

    try {
      // make an async cal lto your API -> create a question
      // contain all form data in values
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>, // 5. Add a keydown event handler for the input
    field: any,
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement // 6. Get the input element
      const tagValue = tagInput.value.trim() // 7. Get the value of the input

      if (tagValue !== '') {
        // 8. Check if the value is not empty
        if (tagValue.length > 15) {
          // 9. Check if the value is less than 15 characters
          return form.setError('tags', {
            // 10. Set an error if the value is more than 15 characters
            type: 'required', // 11. Set the type of error
            message: 'Tag must be less than 15 characters.', // 12. Set the error message
          })
        }

        if (!field.value.includes(tagValue as never)) {
          // 13. Check if the value is not already in the tags array
          form.setValue('tags', [...field.value, tagValue]) // 14. Add the value to the tags array
          tagInput.value = '' // 15. Clear the input
          form.clearErrors('tags') // 16. Clear the error
        }
      } else {
        form.trigger() // 17. Trigger the validation
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    // 18. Add a function to remove a tag
    const newTags = field.value.filter((t: string) => t !== tag) // 19. Filter out the tag

    form.setValue('tags', newTags) // 20. Set the new tags array
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} // 21. Add the submit handler to the form
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control} // 22. Add the control prop to the FormField
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark-400 dark:text-light-800">
                  Question Title<span className="text-primary-500"> *</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Ask a question..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Be specific and imagine you&apos;re your question to another
                  person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark-400 dark:text-light-800">
                  Explanation
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(_evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor
                    }}
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
                        'code',
                      ],
                      toolbar:
                        'undo redo |' +
                        'codesample | bold italic forecolor | alignleft aligncenter |' +
                        'alignright alignjustify | bullist numlist',
                      content_style:
                        'body { font-family:Inter; font-size:16px }',
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark-400 dark:text-light-800">
                  Tags <span className="text-primary-500"> *</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      placeholder="Add tags..."
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />

                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                            onClick={() => handleTagRemove(tag, field)}
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
          <Button
            type="submit"
            className="primary-gradient w-fit bg-primary-500 py-2 text-white hover:bg-primary-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{type === 'edit' ? 'Editing...' : 'Posting...'}</>
            ) : (
              <>{type === 'edit' ? 'Edit Question' : 'Ask a Question'}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Question