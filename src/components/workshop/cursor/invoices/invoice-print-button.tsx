'use client'

import * as React from 'react'
import {DownloadIcon} from 'lucide-react'

import {Button} from '@/ui'

export function InvoicePrintButton() {
  return (
    <Button
      onClick={() => {
        window.print()
      }}
    >
      <span className="pr-2">Download PDF or Print</span>
      <DownloadIcon aria-hidden="true" className="w-5" />
    </Button>
  )
}
