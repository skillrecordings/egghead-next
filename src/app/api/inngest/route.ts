import {serve} from 'inngest/next'
import {inngestConfig} from '@/inngest/innjest.config'

export const {GET, POST, PUT} = serve(inngestConfig)
