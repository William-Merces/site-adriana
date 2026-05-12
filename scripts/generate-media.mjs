import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const root = process.cwd()
const publicDir = join(root, 'public')
const folders = [
  { type: 'image', dir: join(publicDir, 'photos'), extensions: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']) },
  { type: 'video', dir: join(publicDir, 'videos'), extensions: new Set(['.mp4', '.mov', '.webm']) },
]

const titleFromFile = (filePath) =>
  basename(filePath, extname(filePath))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const walk = (folder) => {
  const files = []

  for (const entry of readdirSync(folder.dir, { withFileTypes: true })) {
    const fullPath = join(folder.dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...walk({ ...folder, dir: fullPath }))
      continue
    }

    if (!entry.isFile()) continue

    const extension = extname(entry.name).toLowerCase()
    if (!folder.extensions.has(extension)) continue

    files.push({
      type: folder.type,
      src: relative(publicDir, fullPath).replaceAll('\\', '/'),
      title: titleFromFile(entry.name),
    })
  }

  return files
}

const mediaItems = folders
  .flatMap((folder) => (statSync(folder.dir, { throwIfNoEntry: false }) ? walk(folder) : []))
  .sort((a, b) => a.type.localeCompare(b.type) || a.src.localeCompare(b.src, 'pt-BR'))

const content = `export type MediaItem = {
  type: 'image' | 'video'
  src: string
  title: string
}

export const mediaItems: MediaItem[] = ${JSON.stringify(mediaItems, null, 2)}
`

writeFileSync(join(root, 'src', 'media.generated.ts'), content)
console.log(`Media gerada: ${mediaItems.length} arquivo(s).`)
