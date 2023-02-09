import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return { hello: 'world', time: Date.now() };
  }
  getMetrics(): object {
    return { memory: process.memoryUsage.rss() };
  }
  async getTimeout(): Promise<object> {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve({ hello: 'world', time: Date.now() });
      }, 500),
    );
  }
}
