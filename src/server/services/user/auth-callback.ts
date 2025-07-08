import { byuAccountService, keycloakApi } from '@fhss-web-team/backend-utils';
import { userService } from './user';
import { customUserProvisioning } from './custom-provisioning';
import { RouteHandlerMethod } from 'fastify';
import { prisma } from '../../../../prisma/client';

export const authCallback: RouteHandlerMethod = async (req, res) => {
  ///////////////////
  // DO NOT MODIFY //
  ///////////////////
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send();
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await keycloakApi.verify(token);
    if (!payload) {
      return res.status(400).send({ message: 'No requesting user' });
    }

    const foundUser = await prisma.user.findUnique({
      where: { netId: payload.preferred_username },
    });
    if (foundUser) {
      return res.status(204).send();
    }

    const acct = (
      await byuAccountService.getAccountsByNetId(payload.preferred_username)
    )[0];
    if (!acct) {
      return res.status(400).send({ message: 'Invalid requesting user' });
    }

    const newUser = await userService.provisionUser(acct);

    const nextRoute = customUserProvisioning(newUser);

    return res.status(200).send({ next: nextRoute });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
  ///////////////////
  // DO NOT MODIFY //
  ///////////////////
};
