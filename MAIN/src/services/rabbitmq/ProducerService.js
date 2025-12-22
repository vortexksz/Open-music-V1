import amqp  from 'amqplib';

class ProducerService {
    constructor(rabbitmqUrl) {
        this.server = rabbitmqUrl || 'amqp://localhost:5672';
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        if (this._channel) return;
        this.connection = await amqp.connect(this.server);
        this.channel = await this.connection.createChannel();
    }

    async sendMassage(queue, message) {
        try {
            await this.connect();

            await this.channel.assertQueue(queue, { durable: true });

            const sent = this.channel.sendToQueue (queue, Buffer.from(message), { persistent: true });

            if (!sent) {
                console.warn(`[RabbitMQ] Pesan untuk antrean ${queue} gagal masuk ke channel`,);
            }

            return sent;
        } catch (error) {
            console.error('RabbitMQ Error (Producer)', error);

            throw new Error('Gagal mengirim pesan ke RabbitMQ');
        }
    }

    async close() {
        try {
            if (this.channel) await this.chananel.close();
            if (this.connection) await this.connection.close();

        } catch (error){
            console.error('RabbitMQ Error saat menutup koneksi (Producer)', error);
        }
    }
}

export default ProducerService;