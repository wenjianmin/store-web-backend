-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (arm64)
--
-- Host: 127.0.0.1    Database: store_web_project
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `store_activity`
--

DROP TABLE IF EXISTS `store_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL COMMENT '活动名称',
  `status` int NOT NULL DEFAULT '0' COMMENT '活动状态 0 未开始 1 进行中 2 已结束',
  `type` int NOT NULL COMMENT '活动类型 0 普通活动 1 拼团活动',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `productId` int NOT NULL COMMENT '参与活动的商品id',
  `desc` text NOT NULL COMMENT '活动描述',
  `startTime` timestamp NOT NULL COMMENT '活动开始时间',
  `endTime` timestamp NOT NULL COMMENT '活动结束时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_activity`
--

/*!40000 ALTER TABLE `store_activity` DISABLE KEYS */;
INSERT INTO `store_activity` VALUES (17,'团购活动',2,1,'2024-04-22 16:07:08.778328','2024-04-22 16:11:41.000000',6,'限时团购活动','2024-04-21 21:00:05','2024-04-23 07:00:06'),(18,'限时秒杀活动',2,2,'2024-04-22 16:07:43.785146','2024-04-27 14:05:00.000000',4,'一年一度限时秒杀活动','2024-04-21 21:00:05','2024-04-27 11:00:21'),(19,'门店普通活动',2,0,'2024-04-22 16:08:10.356562','2024-04-27 14:05:00.000000',3,'--','2024-04-21 21:00:05','2024-04-27 11:00:21');
/*!40000 ALTER TABLE `store_activity` ENABLE KEYS */;

--
-- Table structure for table `store_order`
--

DROP TABLE IF EXISTS `store_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '商品名称',
  `count` int NOT NULL DEFAULT '1' COMMENT '商品数量',
  `status` int NOT NULL COMMENT '订单状态 0 未付款 1 已付款 2 已取消',
  `operator` varchar(255) NOT NULL COMMENT '操作员',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `discount` decimal(5,2) NOT NULL DEFAULT '1.00' COMMENT '订单折扣',
  `price` decimal(10,2) NOT NULL COMMENT '订单价格',
  `discountPrice` decimal(10,2) NOT NULL COMMENT '订单折扣价',
  `productId` int NOT NULL COMMENT '商品id',
  `desc` text COMMENT '订单备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_order`
--

/*!40000 ALTER TABLE `store_order` DISABLE KEYS */;
INSERT INTO `store_order` VALUES (1,'洗发水',2,0,'jmin','2024-03-27 07:42:21.094339',1.00,0.00,0.00,0,''),(2,'电饭煲',2,0,'jmin','2024-03-27 07:45:06.318206',1.00,0.00,0.00,0,''),(3,'电饭煲',2,0,'jmin','2024-03-27 07:46:42.598386',1.00,0.00,0.00,0,''),(4,'电饭煲xxx',2,2,'jmin','2024-03-27 07:54:59.273750',0.80,0.24,0.00,0,''),(7,'烧排骨',1,0,'admin','2024-04-06 04:22:22.462637',1.00,26.00,26.00,6,''),(8,'烧排骨',2,2,'admin','2024-04-06 04:22:43.422964',1.00,52.00,52.00,6,''),(9,'烧排骨',2,0,'admin','2024-04-06 04:23:23.361956',1.00,52.00,52.00,6,''),(10,'烧排骨',2,2,'admin','2024-04-06 04:24:40.853055',1.00,52.00,52.00,6,''),(11,'烧排骨',2,1,'admin','2024-04-06 04:27:06.773160',1.00,52.00,52.00,6,'收款了'),(15,'烧排骨',2,2,'admin','2024-04-09 07:31:48.071980',1.00,52.00,52.00,6,NULL),(16,'烧排骨',2,1,'admin','2024-04-09 07:36:38.030703',1.00,52.00,52.00,6,'sdfsdfsd胜多负少答复胜多负少的第三方ssdfsdf'),(17,'白切鸡',1,1,'admin','2024-04-10 05:19:02.379685',1.00,111.00,111.00,3,'1'),(18,'烧鸭',2,0,'admin','2024-04-10 05:19:44.739493',1.00,40.00,40.00,4,'323'),(19,'烧鸭',2,0,'6','2024-04-10 07:56:36.702185',1.00,40.00,40.00,4,'');
/*!40000 ALTER TABLE `store_order` ENABLE KEYS */;

--
-- Table structure for table `store_order_product`
--

DROP TABLE IF EXISTS `store_order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_order_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL COMMENT '商品id',
  `orderId` int NOT NULL COMMENT '订单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_order_product`
--

/*!40000 ALTER TABLE `store_order_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_order_product` ENABLE KEYS */;

--
-- Table structure for table `store_permission`
--

DROP TABLE IF EXISTS `store_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(10) NOT NULL COMMENT '权限名称（菜单名称）',
  `code` varchar(50) NOT NULL COMMENT '权限码',
  `type` int NOT NULL COMMENT '权限类型 0 菜单 1 页面 2 组件 3 按钮',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父级id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_permission`
--

/*!40000 ALTER TABLE `store_permission` DISABLE KEYS */;
INSERT INTO `store_permission` VALUES (1,'首页','Home',0,0),(2,'商品管理','ProductManage',0,0),(3,'订单管理','OrderManage',0,0),(4,'活动管理','ActivityManage',0,0),(5,'系统管理','SysManage',0,0),(6,'用户管理','UserManage',1,5),(7,'角色管理','RoleManage',1,5),(8,'权限管理','PermissionManage',1,5),(9,'商品列表','ProductList',1,2),(10,'热销排行','HotProductList',1,2),(11,'删除商品','delete:product',3,2),(12,'删除订单','delete:order',3,3),(13,'删除活动','delete:activity',3,4),(14,'删除角色','delete:role',3,7),(15,'删除用户','delete:user',3,6),(16,'冻结用户','freezed:user',3,6),(17,'上下架商品','updateStatus:product',3,2),(18,'取消订单','cancel:order',3,3);
/*!40000 ALTER TABLE `store_permission` ENABLE KEYS */;

--
-- Table structure for table `store_permission_api`
--

DROP TABLE IF EXISTS `store_permission_api`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_permission_api` (
  `id` int NOT NULL AUTO_INCREMENT,
  `apiUrl` varchar(50) NOT NULL COMMENT '权限名称',
  `apiMethod` varchar(100) NOT NULL COMMENT '权限码',
  `PermissionId` int NOT NULL COMMENT '功能id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_permission_api`
--

/*!40000 ALTER TABLE `store_permission_api` DISABLE KEYS */;
INSERT INTO `store_permission_api` VALUES (1,'/user/currentUser','GET',6),(2,'/user/delete/:id','GET',15),(3,'/user/list','GET',6),(4,'/user/edit','PATCH',6),(5,'/user/freezed','PATCH',16),(6,'/product/create','POST',2),(7,'/product/list','GET',9),(8,'/product/hot-list','GET',10),(9,'/product/edit','PATCH',2),(10,'/product/delete/:id','GET',11),(11,'/order/create','POST',3),(12,'/order/list','GET',3),(13,'/order/detail/:id','GET',3),(14,'/order/delete/:id','GET',12),(15,'/activity/create','POST',4),(16,'/activity/list','GET',4),(17,'/activity/edit','PATCH',4),(18,'/activity/delete/:id','GET',13),(19,'/role/create','POST',7),(20,'/role/list','GET',7),(21,'/role/edit','PATCH',7),(22,'/role/delete/:id','GET',14),(23,'/permission/list','GET',8),(24,'/product/updateStatus','PATCH',17),(25,'/order/updateOrder','Patch',18);
/*!40000 ALTER TABLE `store_permission_api` ENABLE KEYS */;

--
-- Table structure for table `store_product`
--

DROP TABLE IF EXISTS `store_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '商品名称',
  `images` text COMMENT '商品图片',
  `desc` text NOT NULL COMMENT '商品描述',
  `status` int NOT NULL COMMENT '商品状态 0 未上架  1 已上架 2 已下架',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_product`
--

/*!40000 ALTER TABLE `store_product` DISABLE KEYS */;
INSERT INTO `store_product` VALUES (3,'白切鸡',NULL,'收到发送到发送到递四方速递但是',1,'2024-04-03 17:10:18.915477','2024-04-10 13:38:21.000000',111.00),(4,'烧鸭','http://localhost:3333/uploads/cd9c10536a57de5f1828b7608b53932f2.webp','今日烧鸭',1,'2024-04-03 17:41:10.965627','2024-04-22 11:49:58.000000',20.00),(6,'烧排骨','http://localhost:3333/uploads/2cfdfac2fdb10d846a245133c93a532910.webp','新鲜烧排骨\n',1,'2024-04-03 17:43:22.904154','2024-04-22 11:49:30.000000',26.00);
/*!40000 ALTER TABLE `store_product` ENABLE KEYS */;

--
-- Table structure for table `store_role`
--

DROP TABLE IF EXISTS `store_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  `desc` varchar(255) NOT NULL COMMENT '角色描述',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `isSystem` int NOT NULL DEFAULT '0' COMMENT '是否为系统内置 0 否 1 是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_role`
--

/*!40000 ALTER TABLE `store_role` DISABLE KEYS */;
INSERT INTO `store_role` VALUES (1,'超级管理员','超级管理员拥有最高权限','2024-04-01 00:45:07.829067','2024-04-02 08:13:28.085090',1),(2,'服务员','服务员拥有查看权限','2024-04-01 01:11:18.059408','2024-04-08 06:20:19.264638',0),(3,'收银员','收银员拥有查看和收银权限','2024-04-02 08:07:34.554763','2024-04-08 06:20:34.977659',0),(5,'店长','拥有全部权限，执行敏感操作','2024-04-02 08:10:08.463967','2024-04-08 06:20:05.038298',1);
/*!40000 ALTER TABLE `store_role` ENABLE KEYS */;

--
-- Table structure for table `store_role_permission`
--

DROP TABLE IF EXISTS `store_role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_role_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL COMMENT '角色id',
  `permissionId` int NOT NULL COMMENT '权限集id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_role_permission`
--

/*!40000 ALTER TABLE `store_role_permission` DISABLE KEYS */;
INSERT INTO `store_role_permission` VALUES (35,4,1),(36,4,2),(37,4,4),(38,4,3),(43,5,4),(44,5,6),(45,5,7),(46,5,8),(47,5,1),(61,1,4),(62,1,3),(63,1,10),(64,1,9),(65,1,1),(66,1,7),(67,1,8),(68,1,6),(82,2,10),(83,2,1),(84,2,13),(85,2,15),(86,2,16),(123,3,12),(124,3,9),(125,3,6),(126,3,15),(127,3,16),(128,3,18),(129,3,3);
/*!40000 ALTER TABLE `store_role_permission` ENABLE KEYS */;

--
-- Table structure for table `store_user`
--

DROP TABLE IF EXISTS `store_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL COMMENT '用户登录账号',
  `password` varchar(200) NOT NULL COMMENT '用户登录密码',
  `userType` int NOT NULL DEFAULT '1' COMMENT '用户类型 0 管理员 1 普通用户',
  `email` varchar(255) NOT NULL DEFAULT '' COMMENT '用户邮箱',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `freezed` int NOT NULL DEFAULT '0' COMMENT '是否冻结用户 0 不冻结 1 冻结',
  `salt` varchar(50) NOT NULL COMMENT '哈希加密的盐',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '用户头像',
  `desc` varchar(255) NOT NULL DEFAULT '' COMMENT '用户备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_user`
--

/*!40000 ALTER TABLE `store_user` DISABLE KEYS */;
INSERT INTO `store_user` VALUES (4,'jmin1','$2a$10$dES8lxD3UFWGt36i8Y0./uPC/qsVDVBjbiznwkuvT3O0vqHv6sM.6',1,'125652ss7506@qq.com','2024-04-05 07:28:54.709849',0,'$2a$10$dES8lxD3UFWGt36i8Y0./u','','门店收银员'),(5,'jmin','$2a$10$6eF6.Vd9W4NsDqqTs3BLYO6QkykAnPjF6EJLMbXPcF8WkWt6400nq',0,'12565275062@qq.com','2024-04-05 08:15:57.276214',0,'$2a$10$6eF6.Vd9W4NsDqqTs3BLYO','','我是店长'),(6,'jmin2','$2a$10$0U5kJM8frVHIe3shJJmZ.ez.vz2EBjVIwE5pIL1spHdbOFLpXRMqa',1,'2423423@qq.com','2024-04-05 08:25:48.513570',1,'$2a$10$0U5kJM8frVHIe3shJJmZ.e','',''),(9,'admin','$2a$10$AKsMPb5.59NTabn2l7lczeAMBOhh297UrbVByH/tC8KxhgHWh6Yce',0,'1256527506@qq.com','2024-04-08 03:04:27.480754',0,'$2a$10$AKsMPb5.59NTabn2l7lcze','','');
/*!40000 ALTER TABLE `store_user` ENABLE KEYS */;

--
-- Table structure for table `store_user_role`
--

DROP TABLE IF EXISTS `store_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL COMMENT '用户id',
  `roleId` int NOT NULL COMMENT '角色id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_user_role`
--

/*!40000 ALTER TABLE `store_user_role` DISABLE KEYS */;
INSERT INTO `store_user_role` VALUES (20,9,1),(24,6,2),(25,5,5),(26,4,3);
/*!40000 ALTER TABLE `store_user_role` ENABLE KEYS */;

--
-- Dumping routines for database 'store_web_project'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-28 11:17:23
