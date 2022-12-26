import statics from "@fastify/static";
import formbody from "@fastify/formbody";
import cors, {FastifyCorsOptions} from "@fastify/cors";
import fastifyView from "@fastify/view";
import path from "path";
import ejs from "ejs";
import {FastifyInstance} from "fastify";
export default async function (fastify: FastifyInstance) {
  /* FormBody */
  fastify.register(formbody);
  /* VIEWS */
  // view engine 정의
  // fastify.register(pointOfView, {engine: {ejs}});
  fastify.register(fastifyView, {engine: {ejs}});
  /* STATIC */
  // fastify.register(statics, {root: path.join(__dirname, "../../../dist/assets"), prefix: "/assets/", decorateReply: false});
  fastify.register(statics, {root: path.join(__dirname, "../../../public"), prefix: "/public/", decorateReply: false});
  fastify.register(statics, {
    root: path.join(__dirname, "../../../node_modules"),
    prefix: "/node_modules/",
    decorateReply: false,
  });

  /* CORS */
  fastify.register(cors, (_: any) => {
    return (_: any, callback: (error: Error | null, options: FastifyCorsOptions) => void) => {
      let corsOption: FastifyCorsOptions = {origin: true};
      return callback(null, corsOption);
    };
  });
}
