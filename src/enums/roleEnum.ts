export enum RoleEnum {
  // 超级管理员
  SUPERADMIN = 'super_admin',
  // 管理员
  ADMIN = 'admin',
  // 职员
  USER = 'user',
}

export const roleMap = {
  [RoleEnum.SUPERADMIN]: '超级管理员',
  [RoleEnum.ADMIN]: '管理员',
  [RoleEnum.USER]: '职员',
};

export const roleList = [
  {
    code: RoleEnum.SUPERADMIN,
    name: roleMap[RoleEnum.SUPERADMIN],
  },
  {
    code: RoleEnum.ADMIN,
    name: roleMap[RoleEnum.ADMIN],
  },
  {
    code: RoleEnum.USER,
    name: roleMap[RoleEnum.USER],
  },
];
