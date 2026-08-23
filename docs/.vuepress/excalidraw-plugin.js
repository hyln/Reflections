import { watch } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderToSvg } from './excalidraw-to-svg.js'

const pluginDir = dirname(fileURLToPath(import.meta.url))
const sourceDir = join(pluginDir, '../../excalidraw')
const outDir = join(pluginDir, 'public/excalidraw')

async function* walkExcalidraw(dir) {
  let entries = []
  try {
    entries = await readdir(dir, { withFileTypes: true })
  }
  catch (error) {
    if (error.code === 'ENOENT')
      return
    throw error
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory())
      yield* walkExcalidraw(fullPath)
    else if (entry.name.endsWith('.excalidraw'))
      yield fullPath
  }
}

async function exportFile(filePath) {
  const scene = JSON.parse(await readFile(filePath, 'utf8'))
  const svg = renderToSvg(scene)
  const rel = relative(sourceDir, filePath).replace(/\.excalidraw$/, '.svg')
  const dest = join(outDir, rel)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, svg)
  console.log(`[excalidraw] ${rel}`)
}

async function exportAll() {
  await mkdir(outDir, { recursive: true })
  for await (const filePath of walkExcalidraw(sourceDir))
    await exportFile(filePath)
}

function rewriteExcalidrawImages(md) {
  const defaultRender = md.renderer.rules.image
    || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    if (srcIndex >= 0) {
      const src = token.attrs[srcIndex][1].replaceAll('\\', '/')
      if (src.endsWith('.excalidraw')) {
        const marker = 'excalidraw/'
        const markerIndex = src.lastIndexOf(marker)
        const rel = markerIndex >= 0
          ? src.slice(markerIndex + marker.length)
          : basename(src)
        token.attrs[srcIndex][1] = `/excalidraw/${rel.replace(/\.excalidraw$/, '.svg')}`
      }
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}

export function excalidrawPlugin() {
  return {
    name: 'excalidraw-export',
    async onInitialized() {
      await exportAll()
    },
    onWatched(_app, watchers) {
      const watcher = watch(sourceDir, { recursive: true }, (_event, filename) => {
        if (filename && filename.endsWith('.excalidraw'))
          exportAll().catch(error => console.error('[excalidraw]', error))
      })
      watchers.push(watcher)
    },
    extendsMarkdown: rewriteExcalidrawImages,
  }
}
