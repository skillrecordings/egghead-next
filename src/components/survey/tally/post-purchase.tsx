const PostPurchase = ({email}: any) => {
  console.log(email)
  return (
    <iframe
      src={`https://tally.so/embed/3XQYew?alignLeft=1&hideTitle=1&transparentBackground=0&email=${email}&form_id=post-purchase&question=What brings you here today?`}
      width="100%"
      height="250"
      frameBorder={1}
      marginHeight={1}
      marginWidth={1}
      title="Post Purchase Question"
    ></iframe>
  )
}

export default PostPurchase
