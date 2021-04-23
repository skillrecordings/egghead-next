import {format} from 'date-fns'

const MemberTable = ({members}: {members: any[]}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md mt-2">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member: any, i: number) => {
          const {id, name, email, roles, date_added} = member

          return (
            <li
              key={id}
              className={
                i % 2 === 0
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-white dark:bg-gray-900'
              }
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">
                    {name ? (
                      <span>
                        {name} ({email})
                      </span>
                    ) : (
                      <span>{email}</span>
                    )}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    {/* <p className="cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100 hover:shadow"> */}
                    {/*   Remove */}
                    {/* </p> */}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      {roles.join(', ')}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300 sm:mt-0">
                    <p>
                      Joined on{' '}
                      <time dateTime={date_added}>
                        {format(new Date(date_added), 'yyyy/MM/dd')}
                      </time>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MemberTable
