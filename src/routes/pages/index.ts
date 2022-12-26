import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
export default async function (fastify: FastifyInstance) {
  fastify.get("/", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/views/index.ejs", {test: "ascascasc"});
  });
}
