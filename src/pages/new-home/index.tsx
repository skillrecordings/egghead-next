import * as React from 'react'

const NewHome: React.FunctionComponent<LoginRequiredParams> = ({
  loginRequired,
}) => {
  return (
    <div className="mt-4 sm:mt-8 mb-28 max-w-screen-xl w-full mx-auto">
      <section className="my-8 sm:my-16 flex flex-row justify-between items-center">
        <div className="w-3/5">
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 leading-tighter sm:leading-tighter  text-gray-700">
            Learn the best JavaScript tools and frameworks from industry pros
          </h1>
          <h2 className="text-xl leading-normal text-coolGray-600 w-3/4">
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </h2>
          {/* email input form */}
          <form className="mt-10 flex flex-row items-center">
            <div className="flex flex-col">
              <label className="text-sm font-bold" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                className="w-60"
                placeholder="yourname@email.com"
                onChange={(e) => {}}
              />
            </div>
            <button className="w-30 px-6 mt-4" type="submit">
              Get Started for Free
            </button>
          </form>
        </div>
        <img
          alt="egghead course illustration"
          src="https://via.placeholder.com/400x400"
        />
      </section>
      <section className="my-12 sm:my-32">
        <h3>
          Obviously, you can pick up a new framework or a new language or a new
          platform on your own.
        </h3>
      </section>
    </div>
  )
}

export default NewHome
