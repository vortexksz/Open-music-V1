import redis from 'redis';

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
        port: Number(process.env.REDIS_PORT),
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Error:', error);
    });

    this._client.connect().catch((error) => {
      console.error('Failed to connect to Redis:', error.message);
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) {
      throw new Error('Cache tidak ditemukan');
    }
    return result;
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async delete(key) {
    return this._client.del(key);
  }
}

export default CacheService;
