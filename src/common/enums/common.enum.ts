// 公共枚举
export enum UserType {
  // 超管
  ADMIN_USER = 0,
  // 普通用户
  NORMAL_USER = 1
}

export enum ActivityStatus {
  // 未开始
  NOT_START = 0,
  // 进行中
  IN_PROGRESS = 1,
  // 已结束
  END = 2
}

export enum PermissionType {
  // 菜单
  MENU = 0,
  // 页面
  PAGE = 1,
  // 组件
  COMPONENT = 2,
  // 按钮
  BUTTON = 3
}