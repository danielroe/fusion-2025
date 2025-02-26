import { OpenAI } from 'openai'

export default defineEventHandler(async event => {
  const api = new OpenAI({
    apiKey: useRuntimeConfig().openai.token
  })

  try {
    const { malleables, prompt } = await readBody(event)
    const res = await api.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant in charge of manipulating a web application to suit a user\'s needs. You only speak JSON.'
        },
        {
          role: 'system',
          content: 'The current state of the app is:\n\n' + JSON.stringify(malleables, null, 2)
        },
        {
          role: 'user',
          content: prompt
        },
        {
          role: 'system',
          content: 'Here is the new current state of the app, in JSON:\n\n'
        },
      ]
    })
    return JSON.parse(res.choices[0].message.content!)
  } catch (e) {
    console.error(e)
    return {}
  }
})
