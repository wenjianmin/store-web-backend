// permission.decorator.ts
import { SetMetadata } from '@nestjs/common'

/**
 * 接口允许无权限访问
 */
export const ALLOW_NO_PERMISSION = 'allowNoPerm'

export const AllowNoPermission = () => SetMetadata(ALLOW_NO_PERMISSION, true)
