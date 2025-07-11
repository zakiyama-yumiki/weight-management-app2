import { kv } from '@vercel/kv';

interface KVClient {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  hget<T = unknown>(key: string, field: string): Promise<T | null>;
  hset<T = unknown>(key: string, field: string, value: T): Promise<void>;
  hgetall<T = Record<string, unknown>>(key: string): Promise<T | null>;
  hdel(key: string, field: string): Promise<void>;
}

class MockKVClient implements KVClient {
  private static instance: MockKVClient;
  private store: Map<string, any> = new Map();

  public static getInstance(): MockKVClient {
    if (!MockKVClient.instance) {
      MockKVClient.instance = new MockKVClient();
    }
    return MockKVClient.instance;
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    return this.store.get(key) || null;
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Array.from(this.store.keys()).filter(key => regex.test(key));
  }

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    const hash = this.store.get(key);
    return hash && hash[field] || null;
  }

  async hset<T = unknown>(key: string, field: string, value: T): Promise<void> {
    const hash = this.store.get(key) || {};
    hash[field] = value;
    this.store.set(key, hash);
  }

  async hgetall<T = Record<string, unknown>>(key: string): Promise<T | null> {
    return this.store.get(key) || null;
  }

  async hdel(key: string, field: string): Promise<void> {
    const hash = this.store.get(key);
    if (hash) {
      delete hash[field];
      this.store.set(key, hash);
    }
  }
}

// VercelKVをKVClientインターフェースに適応させるラッパー
class VercelKVAdapter implements KVClient {
  async get<T = unknown>(key: string): Promise<T | null> {
    return kv.get(key);
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    await kv.set(key, value);
  }

  async del(key: string): Promise<void> {
    await kv.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return kv.keys(pattern);
  }

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    return kv.hget(key, field);
  }

  async hset<T = unknown>(key: string, field: string, value: T): Promise<void> {
    await kv.hset(key, { [field]: value });
  }

  async hgetall<T = Record<string, unknown>>(key: string): Promise<T | null> {
    return kv.hgetall(key) as Promise<T | null>;
  }

  async hdel(key: string, field: string): Promise<void> {
    await kv.hdel(key, field);
  }
}

// KVクライアントのインスタンスを作成
function createKVClient(): KVClient {
  // Vercel KVの環境変数が設定されているかチェック
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    console.log('Using Vercel KV');
    return new VercelKVAdapter();
  } else {
    console.log('Using Mock KV Client for local development');
    return MockKVClient.getInstance();
  }
}

export const kvClient = createKVClient();

// 後方互換性のためのエクスポート
export const getKV = (): KVClient => kvClient;