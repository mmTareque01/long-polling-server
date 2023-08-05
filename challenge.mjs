class Queue {
  constructor() {
    this.data = [];
  }

  enqueue(item) {
    this.data.push(item);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.data.shift();
  }

  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.data[0];
  }

  isEmpty() {
    return this.data.length === 0;
  }

  size() {
    return this.data.length;
  }

  clear() {
    this.data = [];
  }
}
const requestQueue = new Queue();

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function blockingGet(key) {
  let resolveFunc;
  const requestPromise = new Promise((resolve) => {
    resolveFunc = resolve;
  });
  requestQueue.enqueue({ key, resolveFunc });

  try {
    return await Promise.race([requestPromise, delay(30000)]);
  } catch (error) {
    return { data: null };
  }
}
export async function push(key, data) {
  const request = requestQueue.front();
  if (request && request.key === key) {
    request.resolveFunc(data);
    requestQueue.dequeue();
  }
}
