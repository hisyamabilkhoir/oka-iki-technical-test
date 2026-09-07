/**
 * Application User Roles
 */
export const ROLES = Object.freeze({
  OWNER: 'owner',
  STAFF: 'staff',
});

/**
 * Check if a role is Owner
 * @param {string} role
 * @returns {boolean}
 */
export function isOwnerRole(role) {
  return role === ROLES.OWNER;
}

/**
 * Check if a role is Staff
 * @param {string} role
 * @returns {boolean}
 */
export function isStaffRole(role) {
  return role === ROLES.STAFF;
}
