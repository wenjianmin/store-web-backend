import { Inject, Injectable } from "@nestjs/common";
import { RedisKeyPrefix } from "src/common/enums/redis-key.enum";
import { RedisService } from "src/common/redis/redis.service";
import { getRedisKey } from "src/common/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class HotSalesService {
  @Inject(RedisService)
  private redisService: RedisService;
  @InjectRepository(ProductEntity)
  private productRepository: Repository<ProductEntity>;

  /**
   * 添加产品销量
   *
   * @param productId 产品ID
   * @param saleCount 销量
   * @returns Promise<void>
   */
  async addProductSales(productId: string, saleCount: number) {
    const client = this.redisService.getClient()
    const redisKey = getRedisKey(RedisKeyPrefix.HOT_SALES)
    await client.zIncrBy(redisKey, saleCount, productId)
  }

  /**
   * 获取热销产品列表前n个
   *
   * @param n 获取数量
   * @returns 返回包含热销产品列表的对象，每个产品包含id、name、price、score等属性，按照score从高到低排序
   */
  async getTopNProducts(n: number) {
    const client = this.redisService.getClient()
    const redisKey = getRedisKey(RedisKeyPrefix.HOT_SALES)
    const scoreList = await client.zRangeWithScores(redisKey, 0, -1)
    const hotIdList = scoreList.reverse().slice(0, n).map(item => item.value)
    console.log('hotIdList', hotIdList)
    const hotList = await this.productRepository.find({where: { id: In(hotIdList) }})
    return {
      list: hotList.map((item, index) => ({ ...item, score: scoreList[index].score })).sort((a, b) => b.score - a.score)
    }
  }
}