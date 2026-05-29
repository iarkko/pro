export type Permission = "read" | "create" | "delete";

export type AuthPermissions = Record<Permission, boolean>;

export type AuthUserView = {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: AuthPermissions;
};
