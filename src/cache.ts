import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const cachePath = path.join(__dirname, '../cache.json')

export const readCache = (): Record<string, string> => {
  if (existsSync(cachePath) === false) {
    return {}
  }

  const cache = readFileSync(cachePath, 'utf-8')

  return JSON.parse(cache)
}

const writeCache = (cache: Record<string, string>) => {
  const cacheString = JSON.stringify(cache)

  writeFileSync(cachePath, cacheString, 'utf-8')
}

export const setToCache = (key: string, value: string) => {
  const cache = readCache()

  cache[key] = value

  writeCache(cache)
}

export const removeFromCache = (key: string) => {
  const cache = readCache()

  delete cache[key]

  writeCache(cache)
}
