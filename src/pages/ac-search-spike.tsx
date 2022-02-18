import * as React from 'react'
import {useAutocomplete} from '../hooks/use-autocomplete'

const AcSearchSpikePage: React.FC<any> = () => {
  const search = useAutocomplete({})

  console.log(search)
  return <div>Hello?</div>
}

export default AcSearchSpikePage
