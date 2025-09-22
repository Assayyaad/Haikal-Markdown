/** @import { ParagraphType } from '../أنواع.js' */

/**
 * Validates section separator format
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateSectionSeparators = (text) => {
  const separators = text.match(/\n---\n/g) || []
  return separators.every((sep) => sep === '\n---\n')
}

/**
 * Validates paragraph separators within sections
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateParagraphSeparators = (text) => {
  // Check if paragraphs are separated by exactly double newlines
  return !text.includes('\n\n\n')
}

/**
 * Validates header format (ATX style only)
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateHeader = (text) => {
  return /^#{1,6}\s.+$/.test(text) && !text.includes('\n')
}

/**
 * Validates list format consistency
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateList = (text) => {
  const lines = text.split('\n')
  const firstLine = lines[0]

  // Determine list type from first line
  const isBullet = /^[-*+]\s/.test(firstLine)
  const isNumbered = /^\d+\.\s/.test(firstLine)
  const isTask = /^[-*+]\s\[([ x])\]/.test(firstLine)

  if (!isBullet && !isNumbered && !isTask) return false

  // Validate consistency across all lines
  return lines.every((line) => {
    if (isBullet) return /^[-*+]\s/.test(line)
    if (isNumbered) return /^\d+\.\s/.test(line)
    if (isTask) return /^[-*+]\s\[([ x])\]/.test(line)
    return false
  })
}

/**
 * Validates media format
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateMedia = (text) => {
  return /^!\[.*?\]\(.+?\)$/.test(text) && !text.includes('\n')
}

/**
 * Validates footnote format
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateFootnote = (text) => {
  return /^\[?\^.+?\]:\s*.+$/.test(text)
}

/**
 * Validates quote format
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateQuote = (text) => {
  const lines = text.split('\n')
  return lines.every((line) => /^>\s?/.test(line))
}

/**
 * Validates code block format
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateCode = (text) => {
  return /^```.*?\n[\s\S]*?\n```$/.test(text)
}

/**
 * Validates table format
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateTable = (text) => {
  const lines = text.split('\n').filter((line) => line.trim())
  return lines.every((line) => /^\|.*\|$/.test(line)) && lines.length >= 2
}

/**
 * Validates paragraph format based on its type
 * @param {string} text
 * @param {ParagraphType} type
 * @returns {boolean}
 * @private
 */
export const validateParagraphType = (text, type) => {
  switch (type) {
    case 'header':
      return validateHeader(text)
    case 'list':
      return validateList(text)
    case 'media':
      return validateMedia(text)
    case 'footnote':
      return validateFootnote(text)
    case 'quote':
      return validateQuote(text)
    case 'code':
      return validateCode(text)
    case 'table':
      return validateTable(text)
    case 'text':
      return true // Text paragraphs are always valid
    default:
      return false
  }
}

/**
 * Validates text formatting syntax
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateTextFormatting = (text) => {
  // Check for unclosed formatting
  const patterns = [
    /\*\*.*?\*\*/g, // bold
    /\*.*?\*/g, // italic
    /`.*?`/g, // code
    /~~.*?~~/g, // strikethrough
    /==.*?==/g // highlight
  ]

  return patterns.every((pattern) => {
    const matches = text.match(pattern) || []
    // Check if all matches are properly closed
    return matches.every((match) => {
      const opener = match.substring(0, match.length / 2)
      const closer = match.substring(match.length / 2)
      return opener === closer || match.includes(opener.slice(-1))
    })
  })
}

/**
 * Validates whitespace consistency
 * @param {string} text
 * @returns {boolean}
 * @private
 */
export const validateWhitespace = (text) => {
  // No trailing whitespace
  const lines = text.split('\n')
  const hasTrailingWhitespace = lines.some((line) => /\s+$/.test(line))

  // No tabs (use spaces)
  const hasTabs = text.includes('\t')

  return !hasTrailingWhitespace && !hasTabs
}

/**
 * يكتشف نوع الفقرة من نص الماركداون
 * @param {string} text
 * @returns {ParagraphType}
 * @internal
 * @example <caption>كشف فقرة عنوان</caption>
 * detectParagraphType('## عنواني')
 * // ==> 'header'
 * @example <caption>كشف فقرة قائمة</caption>
 * detectParagraphType('- عنصر 1\n- عنصر 2')
 * // ==> 'list'
 * @example <caption>كشف كتلة كود</caption>
 * detectParagraphType('```javascript\nconsole.log("بسم الله")\n```')
 * // ==> 'code'
 */
export function detectParagraphType(text) {
  if (/^#{1,6}\s/.test(text)) return 'header'
  if (/^>+\s/.test(text)) return 'quote'
  if (/^-\s(\[([ x])\])?|^\d+\.\s/.test(text)) return 'list'
  if (/^!\[.*\]\(.+\)/.test(text)) return 'media'
  if (/^\[?\^.+\]:/.test(text)) return 'footnote'
  if (/^```/.test(text) && /```$/.test(text)) return 'code'
  if (/^\|.+\|/.test(text)) return 'table'
  return 'text'
}

/**
 * Validates complete markdown structure
 * @param {string} text
 * @returns {{ valid: boolean, errors: string[] }}
 * @public
 */
export const validateMarkdown = (text) => {
  const errors = []

  // Validate section separators
  if (!validateSectionSeparators(text)) {
    errors.push(
      'Invalid section separators - use exactly "---" surrounded by single newlines'
    )
  }

  // Validate whitespace
  if (!validateWhitespace(text)) {
    errors.push('Invalid whitespace - no trailing spaces or tabs allowed')
  }

  // Validate text formatting
  if (!validateTextFormatting(text)) {
    errors.push('Unclosed text formatting detected')
  }

  // Split into sections and validate each
  const sections = text.split('\n---\n')
  sections.forEach((section, sectionIndex) => {
    if (!validateParagraphSeparators(section)) {
      errors.push(
        `Section ${
          sectionIndex + 1
        }: Invalid paragraph separators - use exactly double newlines`
      )
    }

    // Split into paragraphs and validate each
    const paragraphs = section.split('\n\n').filter((p) => p.trim())
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const type = detectParagraphType(paragraph)
      if (!validateParagraphType(paragraph, type)) {
        errors.push(
          `Section ${sectionIndex + 1}, Paragraph ${
            paragraphIndex + 1
          }: Invalid ${type} format`
        )
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Checks if markdown follows Haikal strict rules
 * @param {string} text
 * @returns {boolean}
 * @public
 */
export const isValidHaikal = (text) => validateMarkdown(text).valid
