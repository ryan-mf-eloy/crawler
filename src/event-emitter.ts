import { EventEmitter as EventEmitterNode } from 'node:events';

class EventEmitter extends EventEmitterNode {
  constructor() {
    super();
  }
}

export const eventEmitter = new EventEmitter()
 