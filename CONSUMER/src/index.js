import 'dotenv/config';

import { Pool } from 'pg';
import amqp from 'amqplib';
import MailSender from './MailSender.js';
import Listener from './listener.js';
import PlaylistService from './PlaylistService.js';

const init = async () => {
  const pool = new Pool();

  try {
    const playlistService = new PlaylistService(pool);
    const mailSender = new MailSender();
    const listener = new Listener(playlistService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {
      durable: true,
    });

    channel.consume('export:playlists', listener.listen, { noAck: true });
  } catch (error) {
    console.error('Consumer Gagal:', error);
    process.exit(1);
  }
};

init();
