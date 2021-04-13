import * as React from 'react'
import Link from 'next/link'
import CopyToClipboard from '../components/team/copy-to-clipboard'
import {track} from 'utils/analytics'

export type TeamData = {
  accountId: number
  name: string
  inviteUrl: string
  members: Array<any>
  numberOfMembers: number
  capacity: number
  isFull: boolean
  accountSlug: string | undefined
  stripeCustomerId: string | undefined
}

const qqq = [
  {
    id: 111,
    email: 'qqqqq@ghhjjhh.com',
    name: 'member name',
    roles: ['qqqq', 'wwwwwww'],
    date_added: '01/02/03',
  },
  {
    id: 111,
    email: 'qqqqq@ghhjjhh.com',
    name: 'member name',
    roles: ['qqqq', 'wwwwwww'],
    date_added: '01/02/03',
  },
  {
    id: 111,
    email: 'qqqqq@ghhjjhh.com',
    name: 'member name',
    roles: ['qqqq', 'wwwwwww'],
    date_added: '01/02/03',
  },
  {
    id: 111,
    email: 'qqqqq@ghhjjhh.com',
    name: 'member name',
    roles: ['qqqq', 'wwwwwww'],
    date_added: '01/02/03',
  },
]

const Josh = () => {
  return (
    <div className="max-w-screen-xl mx-auto mb-24">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight md:text-left text-center mt-4 md:mt-0">
        Team Account
      </h1>
      <p className="mt-6 leading-6">
        We are in the process of migrating team accounts to our new website. If
        you would like to manage your account please visit{' '}
        <a href="https://app.egghead.io">https://app.egghead.io</a> and log in
        there. If you need direct assistance please dont hesitate to email{' '}
        <a href="mailto:support@egghead.io">support@egghead.io</a>
      </p>
      <h2 className="font-semibold text-xl mt-16">Team Name</h2>
      <div className="flex flex-col space-y-2 mt-6">
        <input
          className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 block w-full sm:w-1/2 md:w-1/3 appearance-none leading-normal"
          type="text"
          value="teamName"
          onChange={(e) => console.log(e)}
          placeholder="Name"
        />
        <div className="flex flex-row space-x-2">
          <button
            className="text-white bg-green-600 border-0 py-2 px-4 focus:outline-none rounded hover:bg-green-700 "
            type="button"
            onClick={(e) => console.log(e)}
          >
            Save
          </button>
          <button
            className="border border-gray-300 dark:border-0 dark:bg-gray-600 py-2 px-4 focus:outline-none rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={(e) => console.log(e)}
          >
            Cancel
          </button>
        </div>
      </div>
      <h2 className="font-semibold text-xl mt-16">Team Members</h2>
      <p className="mt-6">Your invite link to add new team members is: </p>
      <div className="flex items-center">
        <code>teamData.inviteUrl</code>
        <CopyToClipboard
          stringToCopy="teamData.inviteUrl"
          className="inline-block"
          label={true}
        />
      </div>
      <div
        className="relative px-4 py-1 mt-4 mb-4 leading-normal text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-800 rounded"
        role="alert"
      >
        <span className="absolute inset-y-0 left-0 flex items-center ml-4">
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </span>
        <div className="ml-8 flex flex-col space-y-2 p-2">
          <span>
            Your team account is full. You can add more seats to your account
            through the Stripe Billing Portal.
          </span>
          <Link href="/">
            <a
              onClick={() => {
                track(`clicked manage membership`)
              }}
              className="transition-all duration-150 ease-in-out font-semibold rounded-md dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Visit Stripe Billing Portal
            </a>
          </Link>
        </div>
      </div>
      <h3>Current Team Members (3/3)</h3>
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role(s)</th>
          <th>Date Added</th>
        </tr>
        {qqq.map((member: any, i: number) => {
          return (
            <tr
              key={member.id || member.email}
              className={
                i % 2 === 0
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-white dark:bg-gray-900'
              }
            >
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.roles.join(', ')}</td>
              <td>{member.date_added}</td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default Josh

// const Josh = () => {
//     return (
//       // <div className="lg:prose-lg prose dark:prose-dark xl:prose-xl max-w-screen-xl mx-auto mb-24">
//       <div className="lg:prose-lg prose dark:prose-dark xl:prose-xl max-w-screen-xl mx-auto mb-24">
//         <h1>Team Account</h1>
//         <p>
//           We are in the process of migrating team accounts to our new website. If
//           you would like to manage your account please visit{' '}
//           <a href="https://app.egghead.io">https://app.egghead.io</a> and log in
//           there. If you need direct assistance please dont hesitate to email{' '}
//           <a href="mailto:support@egghead.io">support@egghead.io</a>
//         </p>
//         <h2>Team Name</h2>
//         <div className="flex flex-col space-y-2">
//           <input
//             className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 block w-full sm:w-1/2 md:w-1/3 appearance-none leading-normal"
//             type="text"
//             value="teamName"
//             onChange={(e) => console.log(e)}
//             placeholder="Name"
//           />
//           <div className="flex flex-row space-x-2">
//             <button
//               className={`text-white bg-green-600 border-0 py-0 px-4 focus:outline-none rounded hover:bg-green-700`}
//               type="button"
//               onClick={(e) => console.log(e)}
//             >
//               Save
//             </button>
//             <button
//               className={`bg-white dark:bg-gray-700 border-0 py-0 px-4 focus:outline-none rounded hover:bg-gray-200`}
//               type="button"
//               onClick={(e) => console.log(e)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//         <h2>Team Members</h2>
//         <p>Your invite link to add new team members is: </p>
//         <div className="flex items-center">
//           <code>teamData.inviteUrl</code>
//           <CopyToClipboard
//             stringToCopy="teamData.inviteUrl"
//             className="inline-block"
//             label={true}
//           />
//         </div>
//         <div
//           className="relative px-4 py-1 mt-4 mb-4 leading-normal text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-800 rounded"
//           role="alert"
//         >
//           <span className="absolute inset-y-0 left-0 flex items-center ml-4">
//             <svg
//               className="w-6 h-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           </span>
//           <div className="ml-8 flex flex-col space-y-2 p-2">
//             <span>
//               Your team account is full. You can add more seats to your account
//               through the Stripe Billing Portal.
//             </span>
//             <Link href="/">
//               <a
//                 onClick={() => {
//                   track(`clicked manage membership`)
//                 }}
//                 className="transition-all duration-150 ease-in-out font-semibold rounded-md dark:text-yellow-400 dark:hover:text-yellow-300"
//               >
//                 Visit Stripe Billing Portal
//               </a>
//             </Link>
//           </div>
//         </div>
//         <h3>Current Team Members (3/3)</h3>
//         <table>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role(s)</th>
//             <th>Date Added</th>
//           </tr>
//           {qqq.map((member: any, i: number) => {
//             return (
//               <tr
//                 key={member.id || member.email}
//                 className={
//                   i % 2 === 0
//                     ? 'bg-gray-100 dark:bg-gray-800'
//                     : 'bg-white dark:bg-gray-900'
//                 }
//               >
//                 <td>{member.name}</td>
//                 <td>{member.email}</td>
//                 <td>{member.roles.join(', ')}</td>
//                 <td>{member.date_added}</td>
//               </tr>
//             )
//           })}
//         </table>
//       </div>
//     )
//   }
