import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import clients from "./clients";

export default async function (fastify: FastifyInstance) {
  fastify.register(clients, {prefix: "/client"});
}
