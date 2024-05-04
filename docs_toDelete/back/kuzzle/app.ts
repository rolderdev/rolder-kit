import { Backend, EmbeddedSDK } from "kuzzle";
import fetch from "./src/controllers/fetch";
import search from "./src/controllers/search";
import create from "./src/controllers/create";
import update from "./src/controllers/update";
import deleteC from "./src/controllers/delete";
import { DbClasses } from "./src/types";
import projectJson from './package.json'

let dbClasses: DbClasses = {}

async function getDbClasses(sdk: EmbeddedSDK) {
  const dbClassesResp = await sdk.document.search('config', 'dbclass_v1', {}, { size: 1000 })
  dbClassesResp.hits.map(i => { dbClasses[i._source.name] = i._source as any })
}

export class Application extends Backend {
  get appConfig() { return this.config.content.application }

  constructor() {
    super("application")

    this.controller.register("rolder", {
      actions: {
        fetch: { handler: (r) => fetch(r, this.sdk.as(r.getUser(), { checkRights: true }), dbClasses) },
        search: { handler: (r) => search(r, this.sdk.as(r.getUser(), { checkRights: true }), dbClasses) },
        create: { handler: (r) => create(r, this.sdk.as(r.getUser(), { checkRights: true })) },
        update: { handler: (r) => update(r, this.sdk.as(r.getUser(), { checkRights: true })) },
        delete: { handler: (r) => deleteC(r, this.sdk.as(r.getUser(), { checkRights: true })) },
      }
    })
  }

  async start() {
    await super.start()

    getDbClasses(super.sdk)
    super.sdk.realtime.subscribe('config', 'dbclass_v1', {}, () => getDbClasses(super.sdk))

    this.log.info(`${projectJson.name} backend v${projectJson.version} started`)
  }
}

new Application().start()