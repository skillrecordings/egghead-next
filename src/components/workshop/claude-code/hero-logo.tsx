export default function Logo() {
  return (
    <div
      className="mb-5 sm:mx-0 sm:px-0 px-2 font-mono text-[#24292E] dark:text-[#ce6246]  leading-tight w-full"
      role="img"
      aria-label="Claude Code Workshop ASCII Art Logo"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-2 border border-gray-900 dark:border-none bg-white dark:bg-[#111110] shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:shadow-black rounded-lg justify-center items-center w-full ">
        <div className="w-full bg-gray-900 dark:bg-[#2f2f2c] h-8 flex items-center pl-2 gap-1 rounded-t-lg">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="flex flex-col gap-2 scale-50 sm:scale-100 -my-12 sm:my-0">
          <span className="text-start whitespace-pre">
            {` 
██████╗ ██╗      █████╗ ██╗   ██╗██████╗ ███████╗
██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝
██║     ██║     ███████║██║   ██║██║  ██║█████╗  
██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝  
╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗
╚═════╝╚══════╝╚═╝   ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
        `}
          </span>
          <span className="text-start whitespace-pre">
            {`
██████╗ ██████╗ ██████╗ ███████╗ 
██╔════╝██╔═══██╗██╔══██╗██╔═══╝
██║     ██║   ██║██║  ██║█████╗
██║     ██║   ██║██║  ██║██╔══╝
██████╗╚██████╔╝██████╔╝███████╗
╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝`}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 scale-50 justify-start -mt-16 -mb-12 sm:my-0">
          <span className="text-start whitespace-pre -my-8 sm:my-0 scale-75 sm:scale-100">
            {`
██████╗ ██╗   ██╗ ███████╗
  ██╔══╝██║   ██║ ██╔════╝
  ██║   ██║██╗██║ █████╗  
  ██║   ██║══╝██║ ██╔══╝  
  ██║   ██║   ██║ ███████╗
  ╚═╝═════╝═════╝ ╚══════╝
        `}
          </span>
          <span className="text-start whitespace-pre -mt-8 sm:mt-0 scale-75 sm:scale-100">
            {`
██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗███████╗██╗  ██╗ ██████╗ ██████╗
██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔═══██╗██╔══██╗
██║ █╗ ██║██║   ██║██████╔╝█████╔╝ ███████╗███████║██║   ██║██████╔╝
██║███╗██║██║   ██║██╔══██╗██╔═██╗ ╚════██║██╔══██║██║   ██║██╔═══╝
╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗███████║██║  ██║╚██████╔╝██║
╚══╝╚═╝  ╚═════╝ ╚═╝  ╚═╝ ╚╝   ╚╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝
        `}
          </span>
        </div>
      </div>
    </div>
  )
}
