import * as dotenv from 'dotenv';
import {
  Client,
  ClientConfig,
  MessageAPIResponseBase,
  TextMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import type { Express, Request, Response } from 'express';
import express from 'express';

dotenv.config();

const LISTEN_PORT = process.env.LISTEN_PORT || 3000;
const config: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

// deprecated
// TODO: 新しいClientに変更する
const client = new Client(config);

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_: Request, res: Response) => {
  return res.status(200).send({
    message: 'success',
  });
});

const textEventHandler = async (
  event: WebhookEvent,
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;
  const response: TextMessage = {
    type: 'text',
    text: `${text}と言われましても`,
  };
  await client.replyMessage(replyToken, response);
};

app.post('/webhook', async (req: Request, res: Response) => {
  const events: WebhookEvent[] = req.body.events;
  await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await textEventHandler(event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        return res.status(500);
      }
    }),
  );
  return res.status(200);
});

app.listen(LISTEN_PORT, () => console.log(`listening on port ${LISTEN_PORT}!`));
