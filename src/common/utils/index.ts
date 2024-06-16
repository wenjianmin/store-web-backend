import { RedisKeyPrefix } from "../enums/redis-key.enum";

export function getRedisKey(moduleKey: RedisKeyPrefix, id?: number | string): string {
  return `${moduleKey}${id || ''}`
}

export interface ListToTreeOptions {
  root?: string | number
  pidKey?: string
  idKey?: string
  childKey?: string
}

/**
 * 扁平数组转 树结构
 * @param source
 * @param param
 */
export function listToTree(
  source: any[],
  { root = 0, pidKey = 'pid', idKey = 'id', childKey = 'children' }: ListToTreeOptions
) {
  function getNode(id: string | number) {
    const node = []
    for (let i = 0, len = source.length; i < len; i++) {
      if (source[i][pidKey] === id) {
        const children = getNode(source[i][idKey])
        if (children.length > 0) source[i][childKey] = children
        node.push(source[i])
      }
    }
    return node
  }
  return getNode(root)
}