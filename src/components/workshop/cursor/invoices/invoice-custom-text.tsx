'use client'

import * as React from 'react'
import {useLocalStorage} from 'react-use'

import {Textarea} from '@/ui/textarea'

export function InvoiceCustomText() {
  const [invoiceMetadata, setInvoiceMetadata] = useLocalStorage(
    'invoice-metadata',
    '',
  )
  return (
    <>
      <Textarea
        aria-label="Invoice notes"
        className="border-primary mt-4 h-full w-full border-2 p-3 print:mt-0 print:border-none print:bg-transparent print:p-0 print:text-base"
        value={invoiceMetadata}
        onChange={(e) => setInvoiceMetadata(e.target.value)}
        placeholder="Enter additional info here (optional)"
      />
      {/* <div className="hidden print:block">{invoiceMetadata}</div> */}
    </>
  )
}
