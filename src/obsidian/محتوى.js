/** @import { Section } from '../أنواع.js' * /
/** @import { FileContent } from './ملفات.js' */

/**
 * @param {FileContent} content
 * @returns {{ frontmatter: Frontmatter, text: Paragraph | Paragraph[] | Paragraph[][] }}
 */
export function parse({ frontmatter, text }) {
  return {
    frontmatter: parseFrontmatter(frontmatter),
    text: parseText(text)
  }
}

/**
 * @param {string} text
 * @returns {Frontmatter}
 */
export function parseFrontmatter(text) {
  text = text.trim()

  if (text === '') {
    return {}
  }

  /** @type {Frontmatter} */
  const obj = {}

  // NOTE: parse text as yaml
  text.split('\n').forEach((line) => {
    const parts = line.split(': ')
    const key = parts[0].trim()
    const value = parts[1]?.trim()

    obj[key] = value
  })

  return obj
}

/**
 * @param {string} text
 * @returns {Paragraph | Paragraph[] | Paragraph[][]}
 */
export function parseText(text) {
  text = text.trim()

  /** @type {Section[]} */
  const sections = text.split('\n\n---\n\n').map((section) =>
    section
      .split('\n\n')
      .map(parseParagraph)
      .filter((p) => p !== null)
  )

  return flatArr(flatArr(sections))

  /**
   * @param {Array} arr
   * @returns {Array | (string | object)}
   */
  function flatArr(arr) {
    if (Array.isArray(arr) && arr.length === 1) {
      return arr[0]
    }

    return arr
  }
  /**
   * @param {string} p
   * @returns {Paragraph}
   */
  function parseParagraph(p) {
    p = p.trim()

    if (p.startsWith('![[')) return parseMediaParagraph(p)
    else if (p.startsWith('# ')) return parseHeaderParagraph(p)
    else if (p.startsWith('- ')) return parseListParagraph(p)
    else if (p.startsWith('http')) return parseUrlParagraph(p)
    else return parseTextParagraph(p)

    /**
     * @param {string} p
     * @returns {TextParagraph}
     */
    function parseTextParagraph(p) {
      p = p.trim()

      if (p === '') {
        return null
      }

      return {
        type: 'text',
        content: p
      }
    }
    /**
     * @param {string} p
     * @returns {MediaParagraph}
     */
    function parseMediaParagraph(p) {
      p = p.trim()

      const extensions = {
        image: ['png', 'jpg', 'jpeg'],
        video: ['mp4']
      }

      const clean = p.replace('![[', '').replace(']]', '')
      const [path, alt] = clean.split('|')
      const last = path.lastIndexOf('.')
      const extension = path.substring(last + 1)
      const mediaType = extensions.image.includes(extension)
        ? 'image'
        : extensions.video.includes(extension)
        ? 'video'
        : null

      return {
        type: 'media',
        path,
        alt,
        extension,
        mediaType
      }
    }
    /**
     * @param {string} p
     * @returns {HeaderParagraph}
     */
    function parseHeaderParagraph(p) {
      p = p.trim()

      const parts = p.split(' ')

      return {
        type: 'header',
        text: parts[0].length,
        level: parts.slice(1).join(' ')
      }
    }

    /**
     * @param {string} p
     * @returns {ListParagraph}
     */
    function parseListParagraph(p) {
      p = p.trim()

      const parts = p.split('\n- ')
      parts[0] = parts[0].substring(2)

      let obj = undefined
      if (parts[0].includes(': ')) {
        obj = {}

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i]
          const index = part.indexOf(': ')
          const key = part.substring(0, index)
          const value = part.substring(index + 2 /** ': '.length */)

          obj[key] = value
        }
      }

      return {
        type: 'list',
        items: parts,
        obj
      }
    }

    /**
     * @param {string} p
     * @returns {UrlParagraph}
     */
    function parseUrlParagraph(p) {
      p = p.trim()

      let hostname = new URL(p).hostname
      hostname = hostname.startsWith('www.') ? hostname.substring(4) : hostname

      return {
        type: 'url',
        url: p,
        hostname
      }
    }
  }
}

/**
 * @typedef {{ [key: string]: string }} Frontmatter
 */

/**
 * @typedef {TextParagraph | MediaParagraph| HeaderParagraph | HeaderParagraph | HeaderParagraph} Paragraph
 */

/**
 * @typedef {'text' | 'media' | 'header' | 'list' | 'url'} ParagraphTypes
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} HeaderLevel
 */

/**
 * @typedef {'image' | 'video'} MediaTypes
 */

/**
 * @typedef {object} TextParagraph
 * @property {'text'} type
 * @property {string} content
 */

/**
 * @typedef {object} MediaParagraph
 * @property {'media'} type
 * @property {string} path
 * @property {string} alt
 * @property {string} extension
 * @property {MediaTypes} mediaType
 */

/**
 * @typedef {object} HeaderParagraph
 * @property {'header'} type
 * @property {string} text
 * @property {HeaderLevel} level
 */

/**
 * @typedef {object} ListParagraph
 * @property {'list'} type
 * @property {string[]} items
 * @property {{ [key: string]: string }} [obj=undefined]
 */

/**
 * @typedef {object} UrlParagraph
 * @property {'url'} type
 * @property {string} url
 * @property {string} hostname
 */
