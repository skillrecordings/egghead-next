import {TransformStream} from 'stream/web'

// InstantSearch's chat exports load this browser API even for facet-only tests.
Object.assign(globalThis, {TransformStream})
