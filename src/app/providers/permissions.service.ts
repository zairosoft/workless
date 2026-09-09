import { Injectable } from '@nestjs/common';
import {
  PermissionRecord,
  PermissionServicePort,
} from '@/app/interfaces/permission.interface';

@Injectable()
export class PermissionsService implements PermissionServicePort {
  private readonly roleAliases = new Map<string, string>([
    ['admin', 'platform.admin'],
    ['manager', 'platform.manager'],
    ['user', 'org.member'],
  ]);

  private readonly grants = new Map<string, string[]>([
    [
      'platform.admin',
      [
        'platform.user.read',
        'platform.user.write',
        'platform.company.read',
        'platform.company.write',
        'platform.role.read',
        'platform.permission.read',
        'system.module.read',
        'system.module.install',
        'system.module.uninstall',
        'system.module.upgrade',
        'system.module.seed',
      ],
    ],
    [
      'platform.manager',
      [
        'platform.user.read',
        'platform.user.write',
      ],
    ]
  ]);

  listForRole(roleCode: string): PermissionRecord[] {
    const normalizedRoleCode = this.normalizeRoleCode(roleCode);
    return (this.grants.get(normalizedRoleCode) ?? []).map((permissionCode) =>
      this.toPermission(permissionCode),
    );
  }

  expand(roleCodes: string[]): PermissionRecord[] {
    const permissions = new Map<string, PermissionRecord>();
    for (const roleCode of roleCodes) {
      for (const permission of this.listForRole(roleCode)) {
        permissions.set(permission.code, permission);
      }
    }

    return [...permissions.values()];
  }

  hasPermissions(roleCodes: string[], requiredPermissions: string[]): boolean {
    const availablePermissions = new Set(this.expand(roleCodes).map((permission) => permission.code));
    return requiredPermissions.every((permission) => availablePermissions.has(permission));
  }

  private normalizeRoleCode(roleCode: string): string {
    return this.roleAliases.get(roleCode) ?? roleCode;
  }

  private toPermission(permissionCode: string): PermissionRecord {
    const segments = permissionCode.split('.');
    const action = segments[segments.length - 1] ?? 'read';
    const resource = segments.slice(0, -1).join('.');

    return {
      code: permissionCode,
      resource,
      action,
      description: `${resource} ${action}`.trim(),
    };
  }
}
