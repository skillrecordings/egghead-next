const PostPurchase = ({email}: {email: string}) => {
  return (
    <div className="p-5 mt-4 text-gray-800 rounded-lg dark:bg-gray-800 dark:text-gray-200">
      <iframe
        src={`https://survey.egghead.io/post-purchase?alignLeft=1&hideTitle=1&transparentBackground=1&embed=1&email=${email}&form_id=post-purchase&question=What can egghead help you with today?`}
        width="100%"
        height="400px"
        frameBorder={1}
        marginHeight={1}
        marginWidth={1}
        title="Post Purchase Question"
      ></iframe>
    </div>
  )
}

export default PostPurchase
