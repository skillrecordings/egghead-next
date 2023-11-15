import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

  }

  messages: string[] = [];

  async onStart() {
    this.messages = (await this.party.storage.get<string[]>("messages")) ?? [];
  }

  async onRequest(_req: Party.Request) {
    const messageBody: {requestId: string, body: string, name: string} = await _req.json();

    this.party.broadcast(JSON.stringify(messageBody));

    return new Response(
        `Party ${this.party.id} has received ${this.messages.length} messages`
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
