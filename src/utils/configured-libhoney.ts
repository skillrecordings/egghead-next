import Libhoney from 'libhoney'

export const hny = new Libhoney({
  writeKey: process.env.HONEYCOMB_WRITE_KEY || 'asf',
  dataset: process.env.HONEYCOMB_DATASET || '',
})
