type MetaParams = {
  numbered: boolean
  labeled: boolean
  linesHighlighted: number[]
  filePath?: string
}

export const paramsFromMetastring = (str: string): MetaParams => {
  // numbered check if str contains numbered;
  if (!str || !str.length) {
    return {
      numbered: false,
      labeled: false,
      filePath: '',
      linesHighlighted: [],
    }
  }

  const numbered = str.includes('numbered')
  const labeled = str.includes('labeled')

  // highlighted lines are ranges inside {} connect by -, each range is comma separated
  // example: {1-3, 6-10} will highlight lines n [1,2,3,6,7,8,9,10];
  const linesHighlighted: number[] = []
  const lines = str.match(/{.+}/gm)
  if (lines) {
    // remove brackets
    const line = lines[0].replace('{', '').replace('}', '')
    const ranges = line.split(',')
    for (let i = 0; i < ranges.length; i++) {
      // get lower and upper bound (inclusive)
      const range = ranges[i].split('-')
      for (let j = Number(range[0]); j <= Number(range[1]); j++) {
        linesHighlighted.push(j)
      }
    }
  }

  // path is a string contained between []
  const pathMatch = str.match(/\[.+\]/gm)
  const filePath = pathMatch
    ? typeof pathMatch[0] === 'string'
      ? pathMatch[0].substr(1, pathMatch[0].length - 2)
      : undefined
    : undefined

  // eslint-disable-next-line
  return {
    numbered,
    labeled,
    filePath,
    linesHighlighted: [...(new Set(linesHighlighted) as any)],
  }
}
