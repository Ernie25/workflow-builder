export default function useApi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const fetcher = (path: string) =>
    fetch(`${apiUrl}/${path}`).then((res) => res.json())

  const post = async (path: string, body?: any) => {
    const response = await fetch(`${apiUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  const put = async (path: string, body?: any) => {
    const response = await fetch(`${apiUrl}/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  return { apiUrl, fetcher, post, put }
}
