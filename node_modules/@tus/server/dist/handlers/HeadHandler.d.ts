/// <reference types="node" />
import { BaseHandler } from './BaseHandler';
import { CancellationContext } from '@tus/utils';
import type http from 'node:http';
export declare class HeadHandler extends BaseHandler {
    send(req: http.IncomingMessage, res: http.ServerResponse, context: CancellationContext): Promise<http.ServerResponse<http.IncomingMessage>>;
}
