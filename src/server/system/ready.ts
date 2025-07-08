import { RouteHandlerMethod } from 'fastify';
import { prisma } from '../../../prisma/client';

export const readyCheck: RouteHandlerMethod = async (req, res) => {
  try {

    await prisma.$executeRaw`SELECT 1`;
    return res.send({ msg: 'Ready to receive requests'});
  } catch (err){
    console.error(err);
    return res.status(500).send({ msg: 'Something went wrong!' })
  }
};
