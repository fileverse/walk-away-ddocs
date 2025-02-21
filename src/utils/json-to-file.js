export const jsonToFile = (data, fileName) => {
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  })

  const file = new File([blob], fileName, {
    type: 'application/json',
  })

  return file
}
