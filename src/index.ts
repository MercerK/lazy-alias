import { exit } from 'process'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { readCache, removeFromCache, setToCache } from './cache'

const [command, ...argv] = process.argv.slice(2)

const isValidPath = (path: string) => {
  try {
    fs.accessSync(path, fs.constants.R_OK)

    return true
  } catch (error) {
    return false
  }
}

const main = () => {
  switch (command.toLowerCase()) {
    case 'set': {
      const [key, value] = argv

      if (!key) throw new Error('No key provided')
      if (!value) throw new Error('No value provided')

      if (isValidPath(value) === false) throw new Error('Invalid path provided')

      setToCache(key, path.resolve(process.cwd(), value))

      break
    }

    case 'delete': {
      const [key] = argv

      if (!key) throw new Error('No key provided')

      removeFromCache(key)

      break
    }

    default: {
      const [key, ...rest] = argv
      const cache = readCache()

      if (!key) throw new Error('No key provided')
      if (!cache[command]) throw new Error('Command not found in cache')

      const target = cache[command]
      const isWindows = process.platform === 'win32'

      let cmd = key
      if (isWindows) {
        cmd = `${key}.cmd`
      }

      const child = spawn(cmd, [...rest], { cwd: target, stdio: 'inherit' })

      child.on('message', (message) => {
        console.log(message)
      })

      child.on('error', (error) => {
        console.error(error.message)
        exit(1)
      })

      child.on('exit', (code) => {
        exit(code ?? 0)
      })

      break
    }
  }
}

try {
  main()
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(error)
  }

  exit(1)
}
