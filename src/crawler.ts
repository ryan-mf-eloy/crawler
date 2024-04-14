import EventEmitter from "node:events";
import cheerio from "cheerio";
import { eventEmitter } from "./event-emitter";
import { Readable, Transform, pipeline, Writable } from 'node:stream'
import { writeFileSync } from "node:fs";
import { promisify } from 'node:util'

import style from '../public/style'
import { isValidUrl } from "./utils";

const asyncPipeline = promisify(pipeline)

interface IData {
  src: string;
  alt: string;
}

export class Crawler {
  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly manipulator: typeof cheerio
  ) {
    this.eventEmitter = eventEmitter;
  }

  async execute() {
    try {
      this.eventEmitter.emit('crawler:started', { message: 'Crawler started' });
    
      const readableStream = await this.getReadablePageContent()
      const transformStream = await this.transformPageContent()
      const writableStream = await this.writePageContent()

      await asyncPipeline(readableStream, transformStream, writableStream)
      
      this.eventEmitter.emit('crawler:done', { message: 'Crawler done' });
    } catch (err: any) {
      this.stop(err)
    }
  }

  private stop(err: Error) {
    this.eventEmitter.emit('crawler:stopped', { message: 'Crawler stopped', err });
  }

  private async getReadablePageContent() {
    const response = await fetch(process.env.SITE_TO_SCRAP!, { cache: 'no-cache' });
    const content = await response.text();

    const readable = Readable.from(content);
    return readable
  }

  private async transformPageContent() {
    const manipulator = this.manipulator
    const eventEmitter = this.eventEmitter

    const transform = new Transform({
      objectMode: true,
      async transform(chunk, encoding, callback) {
         eventEmitter.emit('crawler:running', { message: 'Crawler running' });

         const $ = manipulator.load(chunk.toString());

         await Promise.all($('loc').map(async (index, element) => {
             const url = $(element).text();
             
             const response = await fetch(url);
             const content = await response.text();

             const $figures = manipulator.load(content);

             $figures('figure').each((_, element) => {
               const src = $figures(element).find('img').attr('src');
                const alt = $figures(element).find('img').attr('alt');

               if (src && alt && isValidUrl(src)) this.push({ src, alt, url });
             })
         }));

         callback();
      }
    }) 

    return transform
  }

  private async writePageContent() {
    const data: IData[] = []

    const writableStream = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        data.push(chunk);
        callback();
        
      },
      final(callback) {
        /**
         * JSON
         */
        writeFileSync(`./output.json`, JSON.stringify(data, null, 2));
        /**
         * HTML Page
         */
        const images = data.map(({ src, alt }) => {
          if (isValidUrl(src)) return `<div style="background-image: url('${src}')"></div>`;
        });
        writeFileSync(`public/index.html`, `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Crawler</title>${style}</head><body><h1>Imagens obtidas de ${process.env.SITE_TO_SCRAP}</h1><div>${images.join('')}</div></body></html>
        `);
        
        callback();
      }
    })

    return writableStream
  }
}

export const crawler = new Crawler(eventEmitter, cheerio);