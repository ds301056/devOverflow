import { NextResponse } from 'next/server'

// function to hold the route for the chatgpt api
export const POST = async (request: Request) => {
  const { question } = await request.json()

  try {
    // make the request to the chatgpt api
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a knowledgeable assistant that knows coding and advanced programming, providing helpful information and guidance.',
          },
          {
            role: 'user',
            content: `Tell me ${question}`,
          },
        ],
      }),
    })

    // return the response
    const responseData = await response.json()
    const reply = responseData.choices[0].message.content

    return NextResponse.json({ reply })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
