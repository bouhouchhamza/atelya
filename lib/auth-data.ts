/**
 * Mock authentication data source.
 * Contains all user accounts with credentials.
 * In production, this would be replaced by a real auth backend.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain text for mock — replace with hash in production
  role: "admin" | "customer";
  phone?: string;
  avatar?: string;
}

export const MOCK_AUTH_USERS: AuthUser[] = [
  {
    id: "admin_01",
    name: "Sarah Chen",
    email: "admin@aura.com",
    password: "admin123",
    role: "admin",
    phone: "+1 555-0193",
  },
  {
    id: "cust_01",
    name: "Alex Mercer",
    email: "alex@example.com",
    password: "customer123",
    role: "customer",
    phone: "+1 555-0192",
  },
  {
    id: "cust_02",
    name: "Jordan Rivera",
    email: "jordan@example.com",
    password: "customer123",
    role: "customer",
    phone: "+1 555-0194",
  },
  {
    id: "cust_03",
    name: "Maya Patel",
    email: "maya@example.com",
    password: "customer123",
    role: "customer",
    phone: "+1 555-0195",
  },
];

/**
 * Authenticate a user by email + password, restricted to a specific role.
 * Returns the user if credentials match, or null with an error message.
 */
export function authenticateUser(
  email: string,
  password: string,
  requiredRole: "admin" | "customer"
): { user: AuthUser | null; error: string | null } {
  const user = MOCK_AUTH_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { user: null, error: "Invalid email or password." };
  }

  if (user.role !== requiredRole) {
    if (requiredRole === "admin") {
      return { user: null, error: "This account does not have admin access." };
    }
    return { user: null, error: "Please use the admin login portal instead." };
  }

  return { user, error: null };
}

/**
 * Find a user by their ID (for session restoration).
 */
export function findUserById(id: string): AuthUser | null {
  return MOCK_AUTH_USERS.find((u) => u.id === id) || null;
}
