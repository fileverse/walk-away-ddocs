import { UPLOAD_API_URL } from './constants'

export const uploadFileRequest = async (request) => {
  const body = new FormData()
  body.append('file', request.file)
  body.append('name', request.name)

  const response = await fetch(UPLOAD_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': request.apiKey,
    },
    body: body,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  return await response.json() // Parse and return JSON response
}
