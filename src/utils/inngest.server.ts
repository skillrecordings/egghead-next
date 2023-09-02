import {Inngest, EventSchemas} from 'inngest'
import {IngestEvents} from 'pages/api/inngest'

export const inngest = new Inngest({
  name: 'egghead.io',
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
