import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
    const list = [
      {id: 1, name: "hi"},
      {id: 2, name: "hi2"},
    ];
    reply.send(list);
  });
}
