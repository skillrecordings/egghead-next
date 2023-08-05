import { Inngest } from "inngest";
import { serve } from "inngest/next";

// Create a client to send and receive events
export const inngest = new Inngest({ name: "egghead.io" });

type NewTipVideo = {
  name: 'tip/video.uploaded'
  data: {
    tipId: string
    videoResourceId: string
  }
}

export type IngestEvents = {
  'tip/video.uploaded': NewTipVideo
}

const helloWorld = inngest.createFunction(
  { name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("1s");
    return { event, body: "Hello, World!" };
  }
);

// Create an API that serves zero functions
export default serve(inngest, [helloWorld]);
