/** @import { App, TFile, TAbstractFile } from 'obsidian' */

/**
 * @typedef {object} FileContent
 * @property {string} path
 * @property {string} frontmatter
 * @property {string} text
 */

/**
 * Global Obsidian app instance.
 * @type {App}
 */
const app = globalThis.app

/**
 * @param {TFile} file
 * @returns {Promise<Omit<FileContent, 'path'>>}
 * @private
 */
export async function readFile(file) {
  let content = await app.vault.read(file)
  content = content.trim().replace(/\r/g, '')

  return {
    frontmatter: hasFrontmatter(content) ? findFrontmatter(content) : '',
    text: findText(content)
  }
}

/**
 * @param {string} content
 * @returns {string}
 * @private
 */
export function findFrontmatter(content) {
  const splitter = '\n'

  // تقسيم المحتوى إلى أسطر
  const lines = content.split(splitter)

  // معالجة الملف سطرًا بسطر
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      return lines.slice(1, i).join(splitter).trim()
    }
  }

  return 'خطأ: لم يعثر على نهاية الfrontmatter'
}

/**
 * @param {string} content
 * @returns {string}
 * @private
 */
export function findText(content) {
  const splitter = '---\n'

  const sections = content.split(splitter)
  return sections.slice(2).join(splitter).trim()
}

/**
 * @param {string} content
 * @returns {boolean}
 * @private
 */
export function hasFrontmatter(content) {
  return content.trim().startsWith('---')
}

/**
 * @param {string} path
 * @returns {string}
 * @public
 */
export function pathFileName(path) {
  const parts = path.split('/')
  const name = parts[parts.length - 1].replace('.md', '')
  return name
}

/**
 * Reads the frontmatter of the currently active file
 * @returns {Promise<string>}
 * @public
 */
export async function readThisFrontmatter() {
  const file = app.workspace.getActiveFile()
  if (!file) {
    throw new Error('لا يوجد ملف نشط')
  }
  const { frontmatter } = await readFile(file)
  return frontmatter
}

/**
 * @param {string} path
 * @returns {Promise<FileContent | string>}
 * @public
 */
export async function readFilePath(path) {
  // احصل على ملف المصدر
  const file = app.vault.getAbstractFileByPath(path)
  if (!file || !('stat' in file)) {
    return `خطأ: لم يُعثر على الملف في المسار ${path}`
  }

  const content = await readFile(/** @type {TFile} */ (file))
  return {
    path,
    ...content
  }
}
