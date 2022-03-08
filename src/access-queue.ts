export class AccessQueue<T> {
  #queue: T[] = []
  #enabled = false

  beginTracking(): void {
    this.#enabled = true
  }

  add(item: T): void {
    if (this.#enabled === false) return
    this.#queue.push(item)
  }

  flush(): T[] {
    const temp = this.#queue
    this.#queue = []
    this.#enabled = false
    return temp
  }
}

interface Result<T, R> {
  accessedValues: T[]
  result: R
}

export async function withAccessQueueAsync<T, R>(
  accessQueue: AccessQueue<T>,
  run: () => Promise<R>
): Promise<Result<T, R>> {
  accessQueue.beginTracking()
  const r = await run()
  const values = accessQueue.flush()

  return {
    accessedValues: values,
    result: r,
  }
}

export function withAccessQueue<T, R>(accessQueue: AccessQueue<T>, run: () => R): Result<T, R> {
  accessQueue.beginTracking()
  const r = run()
  const values = accessQueue.flush()

  return {
    accessedValues: values,
    result: r,
  }
}
