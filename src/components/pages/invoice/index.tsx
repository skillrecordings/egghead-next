import * as React from 'react'
import {FunctionComponent} from 'react'
import {useLocalStorage} from 'react-use'
import Eggo from '../../images/eggo.svg'

type InvoiceProps = {}

const Invoice: FunctionComponent<InvoiceProps> = () => {
  const [invoiceInfo, setInvoiceInfo] = useLocalStorage('invoice-info', '')
  const invoiceStyles = {
    '.invoice-box': {
      background: '#fff',
      maxWidth: 800,
      minHeight: 1000,
      margin: 'auto',
      padding: '30px',

      boxShadow: '0 0 10px rgba(0, 0, 0, .15)',
      fontSize: '16px',
      lineHeight: '24px',
      fontFamily: '"Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif',
      color: '#555',
      '@media print': {
        boxShadow: 'none',
        border: 'none',
      },
    },

    '.invoice-box table': {
      width: '100%',
      lineHeight: 'inherit',
      textAlign: 'left',
    },

    '.invoice-box table td': {
      padding: '5px',
      verticalAlign: 'top',
    },

    '.invoice-box table th': {
      padding: '5px',
    },

    '.invoice-box table tr td:nth-of-type(2)': {
      textAlign: 'right',
    },

    '.invoice-box table tr.top table td': {
      paddingBottom: '20px',
    },

    '.invoice-box table tr.top table td.title': {
      fontSize: '45px',
      lineHeight: '45px',
      color: '#333',
    },

    '.invoice-box table tr.information table td': {
      paddingBottom: '40px',
    },

    '.invoice-box table tr.heading td': {
      background: '#eee',
      borderBottom: '1px solid #ddd',
      fontWeight: 'bold',
    },

    '.invoice-box table tr.details td': {
      paddingBottom: '20px',
    },

    '.invoice-box table tr.item td': {
      borderBottom: '1px solid #eee',
    },

    '.invoice-box table tr.item.last td': {
      borderBottom: 'none',
    },

    '.invoice-box table tr.total td:nth-of-type(4)': {
      borderTop: '2px solid #eee',
      fontWeight: 'bold',
    },

    '@media only screen and (max-width: 600px)': {
      '.invoice-box table tr.top table td': {
        width: '100%',
        display: 'block',
        textAlign: 'center',
      },

      '.invoice-box table tr.information table td': {
        width: '100%',
        display: 'block',
        textAlign: 'center',
      },
    },

    /** RTL **/
    '.rtl': {
      direction: 'rtl',
      fontFamily:
        'Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif',
    },

    '.rtl table': {
      textAlign: 'right',
    },

    '.rtl table tr td:nth-of-type(2)': {
      textAlign: 'left',
    },
    '.input': {
      '@media print': {
        display: invoiceInfo === '' ? 'none' : 'visible',
        textAlign: 'right',
        lineHeight: 1.5,
        border: 'none',
        padding: 0,
        margin: 0,
        resize: 'none',
      },
    },
  }
  return (
    <div>
      <div className="max-w-screen-md mx-auto pb-16">
        {/* {!isEmpty(teamPurchases) && (
    <div
      className="mb-20"
      css={{'@media print': {display: 'none'}}}
    >
      <h1 className="text-2xl leading-tight sm:mb-0 px-2">
        Invite your team
      </h1>
      <div className="p-2">
        {teamPurchases.map((teamPurchase) => {
          return (
            <div>
              <InviteTeam
                key={teamPurchase.id}
                teamPurchase={teamPurchase}
              />
            </div>
          )
        })}
      </div>
    </div>
  )} */}
        <div
          className="flex sm:flex-row flex-col items-center justify-between py-5"
          css={{'@media print': {display: 'none'}}}
        >
          <h2 className="text-2xl leading-tight sm:mb-0 mb-4">
            Your Invoice for Epic React
          </h2>
          <button
            onClick={() => {
              window.print()
            }}
            className="flex items-center leading-6 pl-4 pr-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors ease-in-out duration-200"
          >
            {/* prettier-ignore */}
            <svg className="inline-flex mr-2 text-indigo-100" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm3.293-7.707a1 1 0 0 1 1.414 0L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" fill="currentColor"/></g></svg>
            Download PDF or Print
          </button>
        </div>
        <div
          css={{...(invoiceStyles as any), '@media print': {border: 'none'}}}
          className="overflow-hidden rounded-lg sm:px-0 px-3 border border-gray-200 shadow-md print:border-none print:shadow-none"
        >
          <div className="invoice-box">
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr className="top">
                  <td colSpan={4}>
                    <table>
                      <tbody>
                        <tr>
                          <td className="title">
                            <Eggo />
                          </td>

                          <td>
                            {/* Invoice #: DC-ER-{get(user, 'purchased[0].id')} */}
                            <br />
                            Created:{' '}
                            {/* {format(
                        parseISO(get(user, 'purchased[0].created_at')),
                        'yyyy/MM/dd',
                      )} */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr className="information">
                  <td colSpan={4}>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            egghead.io LLC
                            <br />
                            337 Garden Oaks Blvd #97429
                            <br />
                            Houston, TX 77018
                            <br />
                            972-992-5951
                          </td>

                          <td>
                            {/* {get(user, 'full_name')} */}
                            <br />
                            {/* {get(user, 'email')} */}
                            <br />
                            <textarea
                              className="input form-textarea p-4 mt-2 h-32 placeholder-opacity-75 placeholder-blue-600 focus:placeholder-blue-200 border border-blue-500 focus:shadow-outline-blue rounded-md leading-tight"
                              value={invoiceInfo}
                              onChange={(e) => setInvoiceInfo(e.target.value)}
                              placeholder="Enter any additional information here. (optional)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr className="heading">
                  <th>Item</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Sub-Total</th>
                </tr>
                {/* {map(
            filter(
              purchased,
              (purchase) => purchase.site === process.env.SITE_NAME,
            ),
            (purchase) => {
              return (
                <tr key={purchase.id}>
                  <td css={{maxWidth: 520}}>
                    Epic React by Kent C. Dodds — {purchase.title}{' '}
                    Bundle
                  </td>
                  <td
                    css={{
                      minWidth: 100,
                      textAlign: 'left !important',
                    }}
                  >
                    ${purchase.price / (purchase.quantity || 1)}
                  </td>
                  <td css={{minWidth: 50}}>{purchase.quantity || 1}</td>
                  <td>
                    {purchase.price === null
                      ? `$0`
                      : `$${purchase.price}`}
                  </td>
                </tr>
              )
            },
          )} */}
                <tr className="total">
                  <td />
                  <td />
                  <td />
                  <td css={{width: 100}}>
                    Total: $
                    {/* {reduce(
                purchased,
                (acc, purchase) => {
                  return acc + purchase.price
                },
                0,
              )} */}
                    .00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
