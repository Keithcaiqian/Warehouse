export enum RoleEnum {
  // 超级管理员
  SUPERADMIN = 'super_admin',
  // 管理员
  ADMIN = 'admin',
  // 职员
  USER = 'user',
}

export const roleList = [
  {
    code: RoleEnum.SUPERADMIN,
    name: '超级管理员',
  },
  {
    code: RoleEnum.ADMIN,
    name: '管理员',
  },
  {
    code: RoleEnum.USER,
    name: '职员',
  },
];
