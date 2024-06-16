-- Active: 1705225958726@@127.0.0.1@3306@store_web_project
-- 接口表
INSERT INTO `store_permission_api` VALUES (6, '/product/create', 'POST', 2);
INSERT INTO `store_permission_api` VALUES (7, '/product/list', 'GET', 2);
INSERT INTO `store_permission_api` VALUES (8, '/product/hot-list', 'GET', 2);
INSERT INTO `store_permission_api` VALUES (9, '/product/edit', 'PATCH', 2);
INSERT INTO `store_permission_api` VALUES (10, '/product/delete/:id', 'GET', 2)


INSERT INTO `store_permission_api` VALUES (11, '/order/create', 'POST', 3);
INSERT INTO `store_permission_api` VALUES (12, '/order/list', 'GET', 3);
INSERT INTO `store_permission_api` VALUES (13, '/order/detail/:id', 'GET', 3);
INSERT INTO `store_permission_api` VALUES (14, '/order/delete/:id', 'GET', 3);
INSERT INTO `store_permission_api` VALUES (25, '/order/updateStatus', 'Patch', 18);

INSERT INTO `store_permission_api` VALUES (15, '/activity/create', 'POST', 4);
INSERT INTO `store_permission_api` VALUES (16, '/activity/list', 'GET', 4);
INSERT INTO `store_permission_api` VALUES (17, '/activity/edit', 'PATCH', 4);
INSERT INTO `store_permission_api` VALUES (18, '/activity/delete/:id', 'GET', 4);

INSERT INTO `store_permission_api` VALUES (19, '/role/create', 'POST', 5);
INSERT INTO `store_permission_api` VALUES (20, '/role/list', 'GET', 5);
INSERT INTO `store_permission_api` VALUES (21, '/role/edit', 'PATCH', 5);
INSERT INTO `store_permission_api` VALUES (22, '/role/delete/:id', 'GET', 5);
INSERT INTO `store_permission_api` VALUES (23, '/permission/list', 'GET', 8);
INSERT INTO `store_permission_api` VALUES (24, '/product/updateStatus', 'PATCH', 17);

-- 权限表 --
INSERT INTO `store_permission` VALUES (11, '删除商品', 'delete:product', 3, 2);
INSERT INTO `store_permission` VALUES (12, '删除订单', 'delete:order', 3, 3);
INSERT INTO `store_permission` VALUES (13, '删除活动', 'delete:activity', 3, 4);
INSERT INTO `store_permission` VALUES (14, '删除角色', 'delete:role', 3, 7);
INSERT INTO `store_permission` VALUES (15, '删除用户', 'delete:user', 3, 6);
INSERT INTO `store_permission` VALUES (16, '冻结用户', 'freezed:user', 3, 6);
INSERT INTO `store_permission` VALUES (17, '上下架商品', 'updateStatus:product', 3, 2);
INSERT INTO `store_permission` VALUES (18, '取消订单', 'updateStatus:order', 3, 3);