import {FastifyInstance} from "fastify";
import api from "@routes/api";
import pages from "./pages";

export default async function (fastify: FastifyInstance) {
  //api
  fastify.register(api, {prefix: "/api/v1"});
  fastify.register(pages, {prefix: "/"});
}
