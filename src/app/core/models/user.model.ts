/**
 * User Model Interface
 * Defines the structure of a logged-in user object.
 * TypeScript interfaces provide compile-time type safety.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}
