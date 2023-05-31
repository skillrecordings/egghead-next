import {createEdgeHandler} from '@upstash/edge-flags'

export default createEdgeHandler({
  // you can omit these to load from env automatically
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const config = {
  runtime: 'edge',
}
