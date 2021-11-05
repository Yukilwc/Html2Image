import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
const PuppenteerHelper = require('./libs/PuppenteerHelper');
import * as fs from 'fs'

const oneDay = 24 * 60 * 60;


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}


@Controller("convert")
export class ConvertController {
  @Get("image")
  async htmlConvertImage(@Req() request: Request) {
    const result: any = await this.handleSnapshot()
    return { code: 10000, message: 'ok', result: result }
    // const  result= 'result2233'
    // console.log('==========result',result)
  }

  async handleSnapshot() {
    try {
      let result = await this.generateSnapshot();
      return result;
    } catch (error) {
      console.error('==========', error)
      return error.toString()
    }

  }

  // /**
  //  * 判断kv中是否有缓存
  //  * @param {String} htmlRedisKey kv存储的key
  //  */
  // async findImageFromCache(htmlRedisKey) {
  //   return false
  // }

  /**
   * 生成截图
   * @param {String} htmlRedisKey kv存储的key
   */
  async generateSnapshot() {
    // let htmlStr = fs.readFileSync("static/email.html").toString()
    // const html = htmlStr || 'html字符串'
    const html = 'https://yukilwc.github.io/'
    const htmlContent = ''
    const width = 1920
    const height = 1000
    const quality = 100
    const ratio = 2
    const imageType = 'jpeg'

    if (!html) {
      return 'html 不能为空'
    }

    let imgBuffer;
    try {
      imgBuffer = await PuppenteerHelper.createImg({
        html,
        width,
        height,
        quality,
        ratio,
        imageType,
        fileType: 'path',
      });
    } catch (err) {
      // logger
      console.log(err)
    }
    let imgUrl;

    // try {
    //   imgUrl = await this.uploadImage(imgBuffer);
    //   // 将海报图片路径存在 Redis 里
    //   await ctx.kvdsClient.setex(htmlRedisKey, oneDay, imgUrl);
    // } catch (err) {
    // }

    return {
      img: imgUrl || ''
    }
  }

  // /**
  //  * 上传图片到 CDN 服务
  //  * @param {Buffer} imgBuffer 图片buffer
  //  */
  // async uploadImage(imgBuffer) {
  //   // upload image to cdn and return cdn url
  // }
}