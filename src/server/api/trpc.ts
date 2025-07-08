import { initTRPC, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import superjson from 'superjson';
import { Role } from '../../roles';
import { keycloakApi } from '@fhss-web-team/backend-utils';

export const createContext = async ({ req }: CreateFastifyContextOptions) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const payload = await keycloakApi.verify(token);
    if (payload) {
      const user = {
        roles: payload.realm_access.roles,
        username: payload.preferred_username,
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
      };
      return { user };
    }
  }
  return {};
};
type Context = Awaited<ReturnType<typeof createContext>>;
type Meta = { allowedRoles: Role[] };

const t = initTRPC
  .context<Context>()
  .meta<Meta>()
  .create({
    transformer: superjson,
    defaultMeta: { allowedRoles: [] },
  });

export const router = t.router;
export const publicProcedure = t.procedure;

export const authenticatedProcedure = publicProcedure.use(
  async ({ meta, ctx, next }) => {
    if (meta === undefined) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userRoles = new Set(ctx.user.roles);
    if (!meta.allowedRoles.some((role) => userRoles.has(role))) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  },
);
