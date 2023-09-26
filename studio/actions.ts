import {useDocumentOperation} from 'sanity'
import {useEffect, useState} from 'react'

export function HelloWorldAction(props:any) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft, isPublishing])


  if (props.type !== 'emailBroadcast') {
    return null
  }
  return {
    label: 'Hello world',
    onHandle: () => {
      // Here you can perform your actions
      window.alert('👋 Hello from custom action')
    }
  }
}
