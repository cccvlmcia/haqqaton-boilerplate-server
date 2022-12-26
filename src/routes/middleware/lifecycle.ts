import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {apiLogger as logger} from "@config/winston.config";

export default function (fastify: FastifyInstance) {
  fastify.addHook("onSend", async (req: FastifyRequest, reply: FastifyReply, _) => {
    const ip = req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"];
    const url = req.url;
    const isNotStatic = false;
    const isNotHealthCheck = userAgent != "ELB-HealthChecker/2.0";
    if (reply.statusCode >= 400) {
      logger.error(`${ip} ${req.method} ${req.protocol}://${req.hostname}${url} ${reply.statusCode} ${userAgent}`);
    } else if (isNotHealthCheck && isNotStatic) {
      logger.info(`${ip} ${req.method} ${req.protocol}://${req.hostname}${url} ${reply.statusCode} ${userAgent}`);
    }
  });
}
