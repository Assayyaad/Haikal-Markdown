/**
 * Fixes section separators to use exactly "---" with proper spacing
 * @param {string} text
 * @returns {string}
 * @private
 */
export const fixSectionSeparators = (text) => {
  return text
    .replace(/\n-{3,}\n/g, '\n---\n')
    .replace(/\n-{1,2}\n/g, '\n---\n')
    .replace(/\n={3,}\n/g, '\n---\n')
}

/**
 * Fixes paragraph spacing to use exactly double newlines
 * @param {string} text
 * @returns {string}
 * @private
 */
export const fixParagraphSpacing = (text) => {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n{2,}---\n{2,}/g, '\n---\n')
    .replace(/\n---\n\n/g, '\n---\n')
    .replace(/\n\n---\n/g, '\n---\n')
}

/**
 * Removes trailing whitespace from all lines
 * @param {string} text
 * @returns {string}
 * @private
 */
export const removeTrailingWhitespace = (text) => {
  return text
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
}

/**
 * Converts tabs to spaces (4 spaces per tab)
 * @param {string} text
 * @returns {string}
 * @private
 */
export const convertTabsToSpaces = (text, tabSize = 4) => {
  const spaces = ' '.repeat(tabSize)
  return text.replace(/\t/g, spaces)
}

/**
 * Normalizes header format to ATX style with single space
 * @param {string} headerText
 * @returns {string}
 * @private
 */
export const normalizeHeader = (headerText) => {
  // Fix ATX headers with multiple spaces
  return headerText.replace(/^(#{1,6})\s{2,}(.+)$/, '$1 $2')
}

/**
 * Normalizes list format with consistent markers and spacing
 * @param {string} listText
 * @returns {string}
 * @private
 */
export const normalizeList = (listText) => {
  const lines = listText.split('\n')
  const firstLine = lines[0]

  // Detect list type
  const isBullet = /^[-*+]\s/.test(firstLine)
  const isNumbered = /^\d+\.\s/.test(firstLine)
  const isTask = /^[-*+]\s+\[([ x])\]/.test(firstLine)

  return lines
    .map((l, index) => {
      if (isBullet) {
        return l.replace(/^[-*+]\s+/, '- ')
      } else if (isNumbered) {
        return l.replace(/^\d+\.\s+/, `${index + 1}. `)
      } else if (isTask) {
        const match = l.match(/^[-*+]\s+\[([ x])\]\s+(.*)/)
        return match ? `- [${match[1]}] ${match[2]}` : l
      }
      return l
    })
    .join('\n')
}

/**
 * Normalizes quote format with consistent spacing
 * @param {string} quoteText
 * @returns {string}
 * @private
 */
export const normalizeQuote = (quoteText) => {
  return quoteText
    .split('\n')
    .map((line) => line.replace(/^>\s*/, '> '))
    .join('\n')
}

/**
 * Normalizes code block format
 * @param {string} codeText
 * @returns {string}
 * @private
 */
export const normalizeCode = (codeText) => {
  // Ensure proper fence format
  return codeText.replace(/^`{3,}/, '```').replace(/`{3,}$/, '```')
}

/**
 * Normalizes table format with consistent spacing
 * @param {string} tableText
 * @returns {string}
 * @private
 */
export const normalizeTable = (tableText) => {
  const lines = tableText.split('\n')
  return lines
    .map((line) => {
      // Ensure spaces around pipes
      return line
        .replace(/\s*\|\s*/g, ' | ')
        .replace(/^\s*\|/, '|')
        .replace(/\|\s*$/, '|')
    })
    .join('\n')
}

/**
 * Fixes text formatting syntax
 * @param {string} text
 * @returns {string}
 * @private
 */
export const fixTextFormatting = (text) => {
  let result = text

  // Fix spaced triple asterisks (bold+italic) formatting
  result = result.replace(/\*\*\* ([^*]*?) \*\*\*/g, '***$1***')

  // Fix spaced double asterisks (bold) formatting
  // Split on triple asterisks first to avoid processing inside them
  const tripleAsterisks = result.split(/(\*\*\*[^*]*?\*\*\*)/g)
  result = tripleAsterisks
    .map((part) => {
      // Only process parts that are not triple asterisk formatted text
      if (!/^\*\*\*[^*]*?\*\*\*$/.test(part)) {
        return part.replace(/\*\* ([^*]*?) \*\*/g, '**$1**')
      }
      return part
    })
    .join('')

  // Fix italic with inconsistent asterisks - use word boundaries
  result = result.replace(/\b\* ([^*]*?) \*\b/g, '*$1*')

  // Fix code with inconsistent backticks
  result = result.replace(/`{2,}(.*?)`{2,}/g, '`$1`')

  // Fix strikethrough - simpler approach
  // First normalize 3+ tildes to 2
  result = result.replace(/~{3,}/g, '~~')
  // Then fix single tildes (not already part of doubles)
  result = result.replace(/([^~])~([^~])/g, '$1~~$2')

  // Fix highlight
  result = result.replace(/={3,}(.*?)={3,}/g, '==$1==')

  return result
}

/**
 * Normalizes paragraph based on its detected type
 * @param {string} paragraphText
 * @returns {string}
 * @private
 */
export const normalizeParagraph = (paragraphText) => {
  const type = detectParagraphType(paragraphText)

  switch (type) {
    case 'header':
      return normalizeHeader(paragraphText)
    case 'list':
      return normalizeList(paragraphText)
    case 'quote':
      return normalizeQuote(paragraphText)
    case 'code':
      return normalizeCode(paragraphText)
    case 'table':
      return normalizeTable(paragraphText)
    case 'text':
    default:
      return fixTextFormatting(paragraphText)
  }
}

/**
 * Helper function to detect paragraph type
 * @param {string} paragraphText
 * @returns {string}
 */
const detectParagraphType = (paragraphText) => {
  if (/^#{1,6}\s/.test(paragraphText)) return 'header'
  if (/^>+\s*/.test(paragraphText)) return 'quote'
  if (
    /^[-*+]\s/.test(paragraphText) ||
    /^\d+\.\s/.test(paragraphText) ||
    /^[-*+]\s\[([ x])\]/.test(paragraphText)
  )
    return 'list'
  if (/^!\[.*\]\(.+\)/.test(paragraphText)) return 'media'
  if (/^\[?\^.+\]:/.test(paragraphText)) return 'footnote'
  if (/^```/.test(paragraphText) && /```$/.test(paragraphText)) return 'code'
  if (/^\|.+\|/.test(paragraphText)) return 'table'
  return 'text'
}

/**
 * Ensures proper document structure (no empty sections)
 * @param {string} text
 * @returns {string}
 * @private
 */
export const fixDocumentStructure = (text) => {
  // Remove empty sections
  const sections = text
    .split('\n---\n')
    .map((s) => s.replace('---', ''))
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  // If no sections remain, return empty string
  if (sections.length === 0) {
    return ''
  }

  return sections.join('\n\n---\n\n')
}

/**
 * Applies all Haikal formatting rules to markdown text
 * @param {string} markdownText
 * @returns {string}
 * @public
 */
export const formatMarkdown = (markdownText) => {
  let formatted = markdownText

  // Apply basic fixes first
  formatted = removeTrailingWhitespace(formatted)
  formatted = convertTabsToSpaces(formatted)
  formatted = fixSectionSeparators(formatted)
  formatted = fixParagraphSpacing(formatted)

  // Process each section and paragraph
  const sections = formatted.split('\n---\n')
  const normalizedSections = sections.map((section) => {
    const paragraphs = section.split('\n\n').filter((p) => p.trim())
    const normalizedParagraphs = paragraphs.map(normalizeParagraph)
    return normalizedParagraphs.join('\n\n')
  })

  formatted = normalizedSections.join('\n\n---\n\n')
  formatted = fixDocumentStructure(formatted)

  return formatted.trim()
}

/**
 * Auto-corrects common markdown mistakes
 * @param {string} markdownText
 * @returns {string}
 * @public
 */
export const autoCorrect = (markdownText) => {
  return formatMarkdown(markdownText)
}

/**
 * Applies specific formatting rule
 * @param {string} text
 * @param {'spacing' | 'headers' | 'lists' | 'quotes' | 'code' | 'tables' | 'formatting'} rule
 * @returns {string}
 * @public
 */
export const applyFormattingRule = (text, rule) => {
  switch (rule) {
    case 'spacing':
      return fixParagraphSpacing(text)
    case 'headers':
      return normalizeHeader(text)
    case 'lists':
      return normalizeList(text)
    case 'quotes':
      return normalizeQuote(text)
    case 'code':
      return normalizeCode(text)
    case 'tables':
      return normalizeTable(text)
    case 'formatting':
      return fixTextFormatting(text)
    default:
      return text
  }
}
