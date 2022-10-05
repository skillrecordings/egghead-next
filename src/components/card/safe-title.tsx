const setSafeHeadingLevel = (h: string): any => {
  const validHeadingLevels = ['h1', 'h2', 'h3', 'h4']
  const safeHeading = h ? h.toLowerCase() : ''

  return validHeadingLevels.includes(safeHeading) ? safeHeading : 'p'
}
const SafeTitle: React.FC<{headingLevel: string; className?: string}> = ({
  children,
  headingLevel,
  className = '',
}) => {
  const Heading = setSafeHeadingLevel(headingLevel) as React.FC<{
    children: React.ReactNode
    className?: string
  }>
  return <Heading className={className}>{children}</Heading>
}

export default SafeTitle
