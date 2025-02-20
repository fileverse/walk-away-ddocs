export const FAILED_IPFS_FETCH_ERROR =
  'Oops failed to load the dDoc from IPFS storage.'

export const getIPFSAsset = async ({ ipfsHash }) => {
  const fetchResponse = await withRetry(() => fetchFromIPFS(ipfsHash), 2)
  if (!fetchResponse) throw new Error(FAILED_IPFS_FETCH_ERROR)

  const data = await fetchResponse.json()
  return { data }
}

export const withRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
}

export const parallelFetch = async (urls) => {
  const AbortControllerMap = new Map()

  const requests = urls.map((url) => {
    const controller = new AbortController()
    AbortControllerMap.set(url, controller)

    return fetch(url, { signal: controller.signal })
      .then((response) => {
        if (response.status === 200) {
          AbortControllerMap.forEach((ctrl, key) => {
            if (key !== url) ctrl.abort()
          })
          return response
        }
        throw new Error(`Failed with status code ${response.status}`)
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return null
        }
        console.error(`Failed to fetch from ${url}`, error)
        return null
      })
  })

  try {
    const response = await Promise.race(requests)
    if (!response) throw new Error('All fetch requests failed.')
    return response
  } catch (_error) {
    throw new Error(
      _error?.message || 'No valid response received from any URL.'
    )
  }
}

export const fetchFromIPFS = async (hash) => {
  try {
    const gatewayUrls = import.meta.env.VITE_PUBLIC_IPFS_GATEWAY_URLS?.split(
      ', '
    )

    if (!gatewayUrls) return

    const response = await parallelFetch(
      gatewayUrls.map((url) => `${url}/ipfs/${hash}`)
    )

    return response
  } catch (error) {
    console.error('All requests failed:', error)
    throw new Error(FAILED_IPFS_FETCH_ERROR)
  }
}
