import ReactMarkdown from 'react-markdown'
const SearchDan = () => {
  return (
    <div className="mb-10 pb-10 py-5 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-trueGray-900">
      <div className="md:pl-8">
        <h1 className="text-2xl font-bold">Dan Abramov</h1>
        <ReactMarkdown className="prose dark:prose-dark mt-0">
          Making hot reloading mainstream. Created React Hot Loader, Redux,
          React DnD.
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default SearchDan
