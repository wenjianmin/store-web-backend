import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler } from '@crawlee/playwright';
import * as cheerio from 'cheerio';

export interface CrawlerResult {
  title: string;
  subtitle: string;
  keywords: string;
  description: string;
  headline: string;
  punchline: string;
  ogData: {
    [key in string]: any;
  };
  cta: string;
  product_images: (string | number | Record<string, string | number>)[];
  pageText: string;
  originUrl: string;
}
@Injectable()
export class CrawlerService {
  async extractUrlInfo(url: string): Promise<CrawlerResult> {
    let result: CrawlerResult;
    let crawler = new PlaywrightCrawler({
      minConcurrency: 5,
      // 最大并发数
      maxConcurrency: 10,
      maxRequestsPerMinute: 20,
      // 页面被拦截导致的失败时不重试
      retryOnBlocked: false,
      // 请求失败重试次数
      maxRequestRetries: 0,
      // requestHandler请求超时时间
      requestHandlerTimeoutSecs: 20,
      launchContext: {
        launchOptions: {
          headless: false,
          args: [
            '--webrtc-ip-handling-policy=disable_non_proxied_udp',
            '--disable-blink-features=AutomationControlled',
            '--force-webrtc-ip-handling-policy',
          ],
        },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        // 无痕模式
        useIncognitoPages: true,
      },
      // 处理请求
      requestHandler: async ({ page, request }) => {
        try {
          const bodyHtml = await page.evaluate(() => document.body.innerHTML);
          const $ = cheerio.load(bodyHtml);

          // 提取标题
          const title = (await page.title()) || '';

          // 提取子标题（假设在h2标签中）
          const subtitle = await page
            .$eval('h2', (el) => el.textContent)
            .catch(() => '');

          await page.evaluate(() => {
            window.scrollBy(0, 300); // 向下滚动 300px
          });
          await page.waitForTimeout(500);
          await page.evaluate(() => {
            window.scrollBy(0, 0); // 回到顶部
          });

          // 提取所有img标签
          const all_product_images = await page.$$eval('img', (imgs) =>
            imgs
              .map((img) => {
                // 兼容懒加载的情况，优先判断从 data-srcset 或 srcset 中提取最大的图片，没有则取 src
                const srcset =
                  img.srcset || img.getAttribute('data-srcset') || '';
                const regex = /(\S+)\s+(\d+)w|x/g;
                const matches = [...srcset.matchAll(regex)];
                const srcList = srcset
                  ? matches
                      .map((match) => ({
                        url: match[1],
                        width: parseInt(match[2], 10),
                      }))
                      .sort((a, b) => a.width - b.width)
                  : [];

                let src = img.src;
                let x = img.getBoundingClientRect().x;
                let y = img.getBoundingClientRect().y;
                if (srcList.length) {
                  const { url } = srcList[srcList.length - 1];
                  src = url;
                  x = y = 0;
                }
                return {
                  src,
                  alt: img.alt,
                  renderWidth: img.clientWidth,
                  renderHeight: img.clientHeight,
                  // 图片所处可视区域x y坐标
                  x,
                  y,
                };
              })
              .filter(
                (img) =>
                  !!img.src &&
                  !img.src.includes('gif') &&
                  !img.src.includes('1x1') &&
                  !/^data:image\/[a-zA-Z0-9+]+;base64,/.test(img.src) &&
                  0.5 <= img.renderWidth / img.renderHeight &&
                  img.renderWidth / img.renderHeight <= 2,
              ),
          );
          // 提取所有带有 background-image 的元素
          const all_background_images = await page.$$eval('div', (elements) =>
            elements
              .map((el) => {
                const style = window.getComputedStyle(el);
                const backgroundImage =
                  style.getPropertyValue('background-image');
                const x = el.getBoundingClientRect().x;
                const y = el.getBoundingClientRect().y;
                const renderWidth = el.clientWidth;
                const renderHeight = el.clientHeight;

                // 提取背景图的 URL
                const backgroundImageUrl = backgroundImage.match(
                  /url\(["']?([^"']*)["']?\)/,
                )?.[1];

                return {
                  src: backgroundImageUrl,
                  x,
                  y,
                  renderWidth,
                  renderHeight,
                };
              })
              .filter(
                (el) =>
                  !!el.src &&
                  !el.src.includes('gif') &&
                  !el.src.includes('1x1') &&
                  !el.src.includes('data:image/png;base64') &&
                  0.5 <= el.renderWidth / el.renderHeight &&
                  el.renderWidth / el.renderHeight <= 2,
              ),
          );

          const filter_product_images = [
            ...all_product_images,
            ...all_background_images,
          ].filter((img) => {
            // 过滤掉图片在可视区域之外的图片
            return (
              -1000 <= img.x && img.x <= 2500 && -500 <= img.y && img.y <= 1000
            );
          });

          let product_images =
            filter_product_images.length >= 5
              ? filter_product_images
              : [...all_product_images, ...all_background_images];
          // 选择前n个最大的图片
          product_images.sort((a, b) => {
            return (
              b.renderWidth * b.renderHeight - a.renderWidth * a.renderHeight
            );
          });

          product_images = product_images.slice(0, 10);

          if (!product_images.length)
            return Promise.reject('No product images found');

          // 获取主标题
          const headline = $('h1').first().text() || '';

          // 提取Punchline
          const possiblePunchlines = ['.punchline', 'h2', 'p'];
          let punchline = '';
          for (const selector of possiblePunchlines) {
            punchline = $(selector).first().text().trim();
            if (punchline) break;
          }

          // 提取OG数据
          const ogData = {};
          $('meta[property^="og:"]').each((_, element) => {
            const property = $(element).attr('property');
            const content = $(element).attr('content');
            if (property && content) {
              ogData[property] = content;
            }
          });

          // 提取CTA (通过内容推断)
          const possibleCTAs = ['button', 'a'];
          const ctaKeywords = [
            '购买',
            '立即购买',
            '加入购物车',
            'Buy',
            'Add to Cart',
            'Add to bag',
          ];
          let cta = '';
          for (const selector of possibleCTAs) {
            $(selector).each((i, el) => {
              const text = $(el).text().trim();
              if (ctaKeywords.some((keyword) => text.includes(keyword))) {
                cta = text;
                return false;
              }
            });
            if (cta !== '') break;
          }

          // 提取关键词
          const keywords = await page
            .$eval('meta[name="keywords"]', (el: HTMLMetaElement) => el.content)
            .catch(() => '');

          // 提取描述
          const description = await page
            .$eval(
              'meta[name="description"], meta[property="og:description"]',
              (el: HTMLMetaElement) => el.content,
            )
            .catch(() => '');

          // 获取页面的文本内容，过滤掉 CSS、换行符、内联脚本、样式和图像等
          let pageText = await page.evaluate(() => {
            // 移除所有 <style> 元素
            document.querySelectorAll('style').forEach((el) => el.remove());

            // 移除所有 <script> 元素
            document.querySelectorAll('script').forEach((el) => el.remove());
            document.querySelectorAll('noscript').forEach((el) => el.remove());

            // 移除所有 <img> 元素
            document.querySelectorAll('img').forEach((el) => el.remove());

            // 返回页面的纯文本内容
            return document.body.textContent;
          });

          await page.close();

          pageText = pageText
            .replace(/\n/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

          // 保存提取的数据
          result = {
            title,
            subtitle,
            keywords,
            description,
            headline,
            punchline,
            ogData,
            cta,
            product_images,
            pageText,
            originUrl: url,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
      errorHandler: ({}, error) => {
        return Promise.reject(error.message);
      },

      // 请求失败处理
      failedRequestHandler: ({}, error) => {
        return Promise.reject(error.message);
      },
    });

    // 添加URL到爬虫队列，uniqueKey为请求的唯一标识
    await crawler.addRequests([{ url, uniqueKey: Math.random().toString() }]);

    await crawler.run();

    crawler = null;

    return Object.keys(result).length > 0
      ? Promise.resolve(result)
      : Promise.reject();
  }
}
