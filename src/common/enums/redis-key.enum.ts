// Redis的key前缀
export const enum RedisKeyPrefix {
  USER_INFO = 'user:info:',
  USER_ROLE = 'user:role:',
  PRODUCT_INFO = 'product:info:',
  ACTIVITY_INFO = 'activity:info:',
  HOT_SALES = 'hot_sales_ranking',
  PASSWORD_RESET = 'password_reset:',
  REGISTRY_CODE = 'registry_code:',
}