import Fastify from "fastify";
import {FastifyInstance} from "fastify";
import {Server, IncomingMessage, ServerResponse} from "http";
import routes from "@routes/index";
import {apiLogger as logger} from "@config/winston.config";
import {initDatasource} from "@lib/db";
import middleware from "@routes/middleware/loader";
const PORT: number = Number(process.env.PORT) || 4000;
const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify();

//middleware
middleware(fastify);

routes(fastify);

async function start() {
  try {
    await initDatasource();
    //https://stackoverflow.com/questions/14043926/node-js-connect-only-works-on-localhost
    await fastify.listen({port: PORT, host: "0.0.0.0"});
    console.log(`server start! http://127.0.0.1:${PORT}/`);
  } catch (err: any) {
    logger.error(`server loading error... ${err}`);
    process.exit(1);
  }
}
start();
