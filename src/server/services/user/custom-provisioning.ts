import { User } from '../../../../prisma/client';

/**
 * Allows developers to implement custom user provisioning logic,
 * including sending the client to a specific route after first login.
 * If no custom provisioning is required, this function should 
 * do nothing and return null.
 * @param user The user object being provisioned.
 * @returns A string representing the frontend route to navigate to,
 * or null if no navigation is needed.
 */
export function customUserProvisioning(_user: User): string | null {
  return null;
}
