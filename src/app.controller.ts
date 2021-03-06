import { Controller, Get, Query, Req, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
const PuppenteerHelper = require('./libs/PuppenteerHelper');
import * as fs from 'fs'
import * as path from 'path'

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
  options = {
    url: '',
    fileType: 'path'
  }
  @Get("image")
  async htmlConvertImage(@Req() request: Request, @Query('url') url) {
    this.options.url = url
    const result: any = await this.handleSnapshot()
    return { code: 10000, message: 'ok', result }
    // const  result= 'result2233'
    // console.log('==========result',result)
  }


  @Get("streamFile")
  async getFile(@Res({ passthrough: true }) res, @Query('url') url) {
    this.options.url = url
    const result: any = await this.handleSnapshot()
    const file = fs.createReadStream(path.join(process.cwd(), result.img));
    res.set({
      // 'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${result.img.split('/')[1]}"`,
    });
    // TODO:有没有类似download的回调，用来删除文件?
    return new StreamableFile(file);
  }

  // TODO:使用express的download进行下载 并最后删除
  @Get("downloadFile")
  async getDownloadFile(@Res({ passthrough: true }) res, @Query('url') url) {
    // this.options.url = url
    // const result: any = await this.handleSnapshot()
    // const file = fs.createReadStream(path.join(process.cwd(), result.img));
    // res.set({
    //   // 'Content-Type': 'application/json',
    //   'Content-Disposition': `attachment; filename="${result.img.split('/')[1]}"`,
    // });
    // return new StreamableFile(file);
  }

  @Get("base64")
  async htmlConvertBase64(@Req() request: Request, @Query('url') url) {
    this.options.url = url
    this.options.fileType = "base64"
    const result: any = await this.handleSnapshot()
    return { code: 10000, message: 'ok', result }
    // const  result= 'result2233'
    // console.log('==========result',result)
  }

  @Get("base64File")
  async htmlConvertBase64File(@Req() request: Request, @Query('url') url, @Res() response: Response) {
    this.options.url = url
    this.options.fileType = "base64"
    const result: any = await this.handleSnapshot()
    const base64 = result.img.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    const dataBuffer = Buffer.from(base64, 'base64') //把base64码转成buffer对象，
    response.setHeader('Content-disposition', 'attachment; filename=generate.png');
    response.send(dataBuffer)
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
    const html = this.options.url
    const htmlContent = ''
    const width = 1920
    const height = 1000
    const quality = 100
    const ratio = 2
    const imageType = 'png'

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
        fileType: this.options.fileType,
      });
    } catch (err) {
      // logger
      console.log(err)
    }
    let imgUrl = imgBuffer

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