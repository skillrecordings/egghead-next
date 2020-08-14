export default function IndexLayout(frontMatter) {
  return ({children: content}) => {
    //We can access frontMatter props here.
    //Leaving the Layout "empty" until we figure out use-cases
    return <>{content}</>
  }
}
