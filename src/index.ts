import { exit } from 'process'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
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

      if (!key) throw new Error('No alias provided')
      if (!value) throw new Error('No path provided')

      if (isValidPath(value) === false) throw new Error('Invalid path provided')

      setToCache(key, path.resolve(process.cwd(), value))

      break
    }

    case 'get': {
      const [key] = argv

      if (!key) throw new Error('No alias provided')

      const cache = readCache()

      if (!cache[key]) throw new Error('Alias not found')

      console.log(cache[key])

      break
    }

    case 'delete': {
      const [key] = argv

      if (!key) throw new Error('No alias provided')

      removeFromCache(key)

      break
    }

    case 'list': {
      const cache = readCache()
      const keys = Object.keys(cache)

      console.log('Lazy Aliases:')

      if (keys.length === 0) {
        console.log('- No aliases')
        break
      }

      for (const key of keys) {
        console.log(`- ${key}: ${cache[key]}`)
      }

      break
    }

    default: {
      const [...rest] = argv
      const cache = readCache()

      if (!cache[command]) throw new Error('Alias not found')

      const target = cache[command]
      const isWindows = process.platform === 'win32'

      let cmd = ''

      if (isWindows) {
        cmd = `powershell.exe`
      } else {
        cmd = `bash`
      }

      const fullCommand = `${[...rest].join(' ')}`

      execSync(fullCommand, {
        cwd: target,
        env: process.env,
        stdio: 'inherit',
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
