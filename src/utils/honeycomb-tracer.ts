import {Tracer} from '@vercel/tracing-js'

const getTracer = (serviceName: string) => {
  return new Tracer(
    {serviceName: serviceName, environment: process.env.ENVIRONMENT},
    {
      writeKey: process.env.HONEYCOMB_WRITE_KEY || 'asf',
      dataset: process.env.HONEYCOMB_DATASET || '',
    },
  )
}

export default getTracer
