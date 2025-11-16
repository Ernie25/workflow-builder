export default function useApi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const fetcher = (path: string) =>
    fetch(`${apiUrl}/${path}`).then((res) => res.json())

  return { apiUrl, fetcher }
}
