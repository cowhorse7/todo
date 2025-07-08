/**
 * Site access roles
 */
export const ROLES = [
  'admin',
  'user',
] as const;
export type Role = typeof ROLES[number];

/**
 * The role given to newly provisioned users.
 */
export const defaultRole: Role = 'user';

/**
 * A map specifying to which route the user should 
 * be directed to upon login, based upon their role.
 */
export const defaultHomePages: Partial<Record<Role, string>> = {
  admin: '/example',
};
