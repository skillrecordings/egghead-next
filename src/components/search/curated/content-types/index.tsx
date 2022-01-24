const ContentTypePage = ({typeData, type}: any) => {
  console.log({type, typeData})

  let isPodcast = type === 'podcast' ? true : false
  return (
    <>
      {isPodcast ? (
        <div>
          <pre>{JSON.stringify(typeData, null, 1)}</pre>
        </div>
      ) : null}
    </>
  )
}

export default ContentTypePage
