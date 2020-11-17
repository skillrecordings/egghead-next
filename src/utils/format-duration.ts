const formatDuration = (duration: number) => {
  const mins = Math.floor(duration / 60)
  const secs = duration % 60
  const formattedSecs = secs < 10 ? `0${secs}` : secs
  return `${mins}:${formattedSecs}`
}

export default formatDuration
