import {FastifyInstance} from "fastify";
import register from "./register";
import lifecycle from "./lifecycle";
export default async function (fastify: FastifyInstance) {
  register(fastify);
  lifecycle(fastify);
}
