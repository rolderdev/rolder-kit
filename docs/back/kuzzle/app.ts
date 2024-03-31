import { Backend } from "kuzzle";
import fetch from "./src/controllers/fetch";
import search from "./src/controllers/search";
import create from "./src/controllers/create";
import update from "./src/controllers/update";
import deleteC from "./src/controllers/delete";

export class Application extends Backend {
  get appConfig() { return this.config.content.application }

  constructor() {
    super("application")

    this.controller.register("rolder", {
      actions: {
        fetch: { handler: (r) => fetch(r, this.sdk.as(r.getUser(), { checkRights: true })) },
        search: { handler: (r) => search(r, this.sdk.as(r.getUser(), { checkRights: true })) },
        create: { handler: (r) => create(r, this.sdk.as(r.getUser(), { checkRights: true })) },
        update: { handler: (r) => update(r, this.sdk.as(r.getUser(), { checkRights: true })) },
        delete: { handler: (r) => deleteC(r, this.sdk.as(r.getUser(), { checkRights: true })) },
      }
    })
  }

  async start() {
    await super.start()
    this.log.info("Rolder Kit backend v0.2.0 started")
  }
}

new Application().start()
