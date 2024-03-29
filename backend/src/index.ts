import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import { ClientConfig, MessageAPIResponseBase, TextMessage, WebhookEvent } from '@line/bot-sdk';
import { BigQuery } from '@google-cloud/bigquery';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { MessagingApiClient, ReplyMessageRequest } from '@line/bot-sdk/dist/messaging-api/api';

dotenv.config();

const PORT = process.env.PORT || 3000;
const config: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const bqDatasetName = process.env.BQ_DATASET_NAME || '';
const bqTableName = process.env.BQ_TABLE_NAME || '';

const client = new MessagingApiClient(config);
const bqClient = new BigQuery();
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

  const { replyToken, timestamp, message: { text } = {}, source: { userId } = {} } = event;

  const row = {
    user_id: userId,
    message: text,
    recieved_at: BigQuery.timestamp(new Date(timestamp)),
  };

  try {
    await bqClient.dataset(bqDatasetName).table(bqTableName).insert([row]);
  } catch (e) {
    console.error('[ERROR] Failed insert message into bq');
    console.error(e);
  }

  const response: TextMessage = {
    type: 'text',
    text: `${text}と言われましても`,
  };

  const replyMessageRequest: ReplyMessageRequest = {
    replyToken: replyToken,
    messages: [response],
  };

  await client.replyMessage(replyMessageRequest);
};

const isInvalidSignature = (req: Request): boolean => {
  const reqLineSignature: string = req.header('x-line-signature') ?? '';
  const channelSecret: string = process.env.LINE_CHANNEL_SECRET || '';
  const bodyString: string = JSON.stringify(req.body);
  const signature: string = crypto
    .createHmac('SHA256', channelSecret)
    .update(bodyString)
    .digest('base64');

  return signature !== reqLineSignature;
};

app.post('/webhook', async (req: Request, res: Response) => {
  if (isInvalidSignature(req)) {
    return res.status(401).end();
  }

  const events: WebhookEvent[] = req.body.events;
  await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await textEventHandler(event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        return res.status(500).end();
      }
    }),
  );
  return res.status(200).end();
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
