import {serve} from "inngest/next"
import {inngestConfig} from "@/inngest/inngest.config"

export const {GET, POST, PUT} = serve(inngestConfig)
