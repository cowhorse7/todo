import { RouteHandlerMethod } from 'fastify';

export const heartbeat: RouteHandlerMethod = (req, res) => {
  return res.send({ msg: 'All good!'});
};
