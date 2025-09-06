/** @import { CodeParagraph, CodingLanguages, Footnote, FootnoteParagraph, HeaderLevel, HeaderParagraph, ListParagraph, ListType, MediaExtension, MediaParagraph, Paragraph, ParagraphContent, ParagraphType, ParsedMarkdownFile, QuoteParagraph, Section, TableParagraph, TextFormat, TextFormatType, TextParagraph } from '../أنواع.js' */

import { detectParagraphType } from './تحقق.js'

/**
 * يستخرج تنسيقات النص من نص الماركداون
 * @param {string} text - نص الماركداون
 * @returns {ParagraphContent} - المحتوى النصي مع التنسيقات المستخرجة
 * @private
 */
export function extractTextFormats(text) {
  /** @type {TextFormat[]} */
  const formats = []

  // معالجة التنسيقات بترتيب الأولوية لتجنب التعارضات
  /** @type {{pattern: RegExp, type: TextFormatType, markupLength: number}[]} */
  const formatPatterns = [
    { pattern: /\*\*(.*?)\*\*/g, type: 'bold', markupLength: 4 },
    { pattern: /\*(.*?)\*/g, type: 'italic', markupLength: 2 },
    { pattern: /`(.*?)`/g, type: 'code', markupLength: 2 },
    { pattern: /~~(.*?)~~/g, type: 'strikethrough', markupLength: 4 },
    { pattern: /==(.*?)==/g, type: 'highlight', markupLength: 4 }
  ]

  for (const { pattern, type, markupLength } of formatPatterns) {
    let match
    let currentOffset = 0

    // إعادة تعيين النمط للبدء من البداية
    pattern.lastIndex = 0

    while ((match = pattern.exec(text)) !== null) {
      const start = match.index - currentOffset
      const content = match[1]

      formats.push({
        type,
        start,
        end: start + content.length
      })

      // استبدال التطابق بالمحتوى فقط
      text =
        text.slice(0, match.index) +
        content +
        text.slice(match.index + match[0].length)

      // تحديث الإزاحة
      currentOffset += markupLength

      // إعادة تعيين lastIndex للاستمرار في البحث من موضع الاستبدال
      pattern.lastIndex = match.index + content.length
    }
  }

  return { text, formats }
}

/**
 * يحول تنسيقات النص إلى صيغة الماركداون
 * @param {string} text - النص الأساسي
 * @param {TextFormat[]} formats - تنسيقات النص مع النطاقات
 * @returns {string} - النص مع تنسيقات الماركداون المطبقة
 * @private
 */
export function applyTextFormats(text, formats = []) {
  if (!formats.length) return text

  // إنشاء مصفوفة لتتبع العلامات التي يجب تطبيقها في كل موضع
  /** @type {{open: TextFormatType[], close: TextFormatType[]}[]} */
  const markup = Array(text.length + 1)
    .fill(null)
    .map(() => ({ open: [], close: [] }))

  // ترتيب التنسيقات حسب موضع البداية، ثم حسب موضع النهاية (التنسيقات الأطول أولاً للتداخل الأفضل)
  const sortedFormats = [...formats].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    return b.end - a.end // التنسيقات الأطول أولاً
  })

  // وضع علامات الفتح والإغلاق
  for (const format of sortedFormats) {
    markup[format.start].open.push(format.type)
    markup[format.end].close.unshift(format.type) // ترتيب عكسي للتداخل الصحيح
  }

  // بناء النص النتيجة
  let result = ''
  for (let i = 0; i <= text.length; i++) {
    // إضافة علامات الإغلاق
    for (const type of markup[i].close) {
      switch (type) {
        case 'bold':
          result += '**'
          break
        case 'italic':
          result += '*'
          break
        case 'strikethrough':
          result += '~~'
          break
        case 'highlight':
          result += '=='
          break
        case 'code':
          result += '`'
          break
        case 'subscript':
          result += '~'
          break
        case 'superscript':
          result += '^'
          break
      }
    }

    // إضافة علامات الفتح
    for (const type of markup[i].open) {
      switch (type) {
        case 'bold':
          result += '**'
          break
        case 'italic':
          result += '*'
          break
        case 'strikethrough':
          result += '~~'
          break
        case 'highlight':
          result += '=='
          break
        case 'code':
          result += '`'
          break
        case 'subscript':
          result += '~'
          break
        case 'superscript':
          result += '^'
          break
      }
    }

    // إضافة الحرف إذا لم نكن في النهاية
    if (i < text.length) {
      result += text[i]
    }
  }

  return result
}

/**
 * يحلل فقرة نصية
 * @param {string} text - نص الفقرة
 * @returns {TextParagraph} - فقرة نصية مع المحتوى المنسق
 * @private
 */
export function parseText(text) {
  return {
    type: 'text',
    content: extractTextFormats(text)
  }
}

/**
 * يحلل فقرة العنوان
 * @param {string} text - نص الفقرة
 * @returns {HeaderParagraph} - فقرة عنوان مع المستوى والمحتوى المنسق
 * @private
 */
export function parseHeader(text) {
  const match = text.match(/^(#{1,6})\s(.+)$/)
  if (!match) throw new Error('Invalid header format')

  const level = /** @type {HeaderLevel} */ (match[1].length)
  return {
    type: 'header',
    level,
    content: extractTextFormats(match[2])
  }
}

/**
 * يحلل فقرة قائمة
 * @param {string} text - نص الفقرة
 * @returns {ListParagraph} - فقرة قائمة مع نوع القائمة والمحتويات المنسقة
 * @private
 */
export function parseList(text) {
  const lines = text.split('\n')
  let listType = /** @type {ListType} */ ('bullet')

  if (/^\d+\./.test(lines[0])) listType = 'number'
  if (/^-\s\[([ x])\]/.test(lines[0])) listType = 'task'

  const contents = lines.map((line) => {
    const content = line.replace(/^[-\d.)\s]*(\[([ x])\])?\s?/, '')
    return extractTextFormats(content)
  })

  return {
    type: 'list',
    listType,
    contents
  }
}

/**
 * يحلل فقرة الوسائط
 * @param {string} text - نص الفقرة
 * @returns {MediaParagraph} - فقرة وسائط مع المحتوى المنسق
 * @private
 */
export function parseMedia(text) {
  // التعامل مع الوسائط المربوطة: [![alt](path)](url)
  const linkedMatch = text.match(/^\[!\[(.*?)\]\((.+?)\)\]\((.+?)\)$/)
  // التعامل مع الوسائط العادية: ![alt](path)
  const match = linkedMatch || text.match(/^!\[(.*?)\]\((.+?)\)$/)
  if (!match) throw new Error('Invalid media format')

  /** @type {MediaParagraph} */
  const parsed = {
    type: 'media',
    path: match[2]
  }

  if (linkedMatch) {
    parsed.url = linkedMatch[3]
  }

  if (match[1]) parsed.alt = match[1]

  // كشف نوع الوسائط بواسطة الامتداد
  const extension = /** @type {MediaExtension | undefined} */ (
    parsed.path.split('.').pop()?.toLowerCase()
  )
  if (extension) {
    if (['gif'].includes(extension)) parsed.mediaType = 'gif'
    if (['png', 'jpg', 'jpeg', 'webp'].includes(extension))
      parsed.mediaType = 'image'
    if (['mp4', 'webm', 'avi', 'mov'].includes(extension))
      parsed.mediaType = 'video'
    if (['mp3', 'wav', 'ogg', 'flac'].includes(extension))
      parsed.mediaType = 'audio'

    if (parsed.mediaType) {
      parsed.extension = extension
    }
  }

  return parsed
}

/**
 * Parses footnote paragraph
 * @param {string} text - نص الفقرة
 * @returns {FootnoteParagraph} - فقرة حواشي مع قائمة الحواشي
 * @private
 */
export function parseFootnotes(text) {
  // التقسيم بالأسطر الجديدة، تصفية الأسطر الفارغة
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  /** @type {Footnote[]} */
  const footnotes = []

  for (const line of lines) {
    const match = line.match(/^\[?\^(.+?)\]:\s*(.+)$/)
    if (!match) continue // تخطي الأسطر غير الصالحة

    footnotes.push({
      number: parseInt(match[1]),
      text: match[2]
    })
  }

  if (footnotes.length === 0) {
    throw new Error('Invalid footnote format')
  }

  return {
    type: 'footnote',
    list: footnotes
  }
}

/**
 * يحلل فقرة الاقتباس (يمكن أن تحتوي على فقرات متداخلة)
 * @param {string} text - نص الفقرة
 * @returns {QuoteParagraph} - فقرة اقتباس مع الفقرات المتداخلة
 * @private
 */
export function parseQuote(text) {
  const lines = text.split('\n').map((l) => l.replace(/^>\s?/, ''))
  const quotedText = lines.join('\n')
  const paragraphs = splitIntoParagraphs(quotedText).map(parseParagraph)

  return {
    type: 'quote',
    paragraphs
  }
}

/**
 * يحلل فقرة الكود
 * @param {string} text - نص الفقرة
 * @returns {CodeParagraph} - فقرة كود مع اللغة والنص
 * @private
 */
export function parseCode(text) {
  const match = text.match(/^```(\w+)?\n?([\s\S]*?)\n?```$/)
  if (!match) throw new Error('Invalid code format')

  return {
    type: 'code',
    language: /** @type {CodingLanguages} */ (match[1]),
    text: match[2]
  }
}

/**
 * يحلل فقرة الجدول
 * @param {string} text - نص الفقرة
 * @returns {TableParagraph} - فقرة جدول مع الصفوف والمحتويات المنسقة
 * @private
 */
export function parseTable(text) {
  const lines = text.split('\n').filter((l) => l.trim())
  const rows = lines
    .filter((l, i) => i === 0 || !l.match(/^[\|\s\-:]+$/)) // تخطي صف الفاصل
    .map((l) => {
      return l
        .split('|')
        .slice(1, -1) // إزالة العناصر الفارغة الأولى/الأخيرة
        .map((cell) => extractTextFormats(cell.trim()))
    })

  return {
    type: 'table',
    rows
  }
}

/**
 * يحول محتوى الفقرة إلى نص ماركداون
 * @param {ParagraphContent} content - محتوى الفقرة
 * @returns {string} - نص الماركداون مع التنسيقات المطبقة
 * @private
 */
export function serializeParagraphContent(content) {
  return applyTextFormats(content.text, content.formats)
}

/**
 * يحول الفقرة إلى نص ماركداون
 * @param {Paragraph} paragraph - الفقرة المراد تحويلها
 * @returns {string} - نص الماركداون
 * @public
 * @example <caption>تحويل فقرة عنوان</caption>
 * serializeParagraph({ type: 'header', level: 2, content: { text: 'العنوان', formats: [] } })
 * // ==> '## العنوان'
 * @example <caption>تحويل فقرة قائمة</caption>
 * serializeParagraph({ type: 'list', listType: 'bullet', contents: [{ text: 'عنصر 1', formats: [] }] })
 * // ==> '- عنصر 1'
 */
export function serializeParagraph(paragraph) {
  switch (paragraph.type) {
    case 'text':
      return serializeParagraphContent(paragraph.content)

    case 'header':
      return (
        '#'.repeat(paragraph.level) +
        ' ' +
        serializeParagraphContent(paragraph.content)
      )

    case 'list':
      return paragraph.contents
        .map((content, index) => {
          const marker =
            paragraph.listType === 'number'
              ? `${index + 1}. `
              : paragraph.listType === 'task'
                ? '- [ ] '
                : '- '
          return marker + serializeParagraphContent(content)
        })
        .join('\n')

    case 'media':
      return `![${paragraph.alt}](${paragraph.path})`

    case 'footnote':
      return paragraph.list
        .map(({ number, text }) => `[^${number}]: ${text}`)
        .join('\n')

    case 'quote':
      return paragraph.paragraphs
        .map((p) => serializeParagraph(p))
        .map((text) =>
          text
            .split('\n')
            .map((line) => '> ' + line)
            .join('\n')
        )
        .join('\n\n')

    case 'code':
      return `\`\`\`${paragraph.language}\n${paragraph.text}\n\`\`\``

    case 'table':
      return paragraph.rows
        .map(
          (row) => '| ' + row.map(serializeParagraphContent).join(' | ') + ' |'
        )
        .join('\n')

    default:
      return paragraph
  }
}

/**
 * يحول القسم إلى نص ماركداون
 * @param {Section} section - القسم المراد تحويله
 * @returns {string} - نص الماركداون للقسم
 * @public
 */
export function serializeSection(section) {
  return section.map(serializeParagraph).join('\n\n')
}

/**
 * يحول الماركداون المحلل إلى نص ماركداون خام
 * @param {Section[]} sections - الأقسام المحللة
 * @returns {string} - نص الماركداون الكامل مع فواصل الأقسام
 * @public
 * @example <caption>تحويل الأقسام المحللة إلى ماركداون</caption>
 * serializeMarkdown([[headerParagraph, textParagraph], [headerParagraph]])
 * // ==> '# العنوان\n\nالمحتوى\n\n---\n\n## العنوان الفرعي'
 */
export function serializeMarkdown(sections) {
  return sections.map(serializeSection).join('\n\n---\n\n')
}

/**
 * يقسم نص الماركداون إلى أقسام بواسطة فاصل الشرطات الثلاث
 * @param {string} text - نص الماركداون الكامل
 * @returns {string[]} - مصفوفة من نصوص الأقسام
 * @public
 * @example <caption>تقسيم الماركداون إلى أقسام</caption>
 * splitIntoSections('# القسم 1\n\nالمحتوى\n\n---\n\n# القسم 2\n\nمحتوى أكثر')
 * // ==> ['# القسم 1\n\nالمحتوى', '# القسم 2\n\nمحتوى أكثر']
 */
export function splitIntoSections(text) {
  // التقسيم على الأسطر التي تحتوي على --- فقط (مع مسافات اختيارية)
  const lines = text.split('\n')
  const sections = []
  let currSection = []

  for (const line of lines) {
    if (/^\s*---\s*$/.test(line)) {
      // هذا سطر فاصل
      if (currSection.length > 0) {
        sections.push(currSection.join('\n').trim())
        currSection = []
      }
    } else {
      currSection.push(line)
    }
  }

  // إضافة القسم الأخير إذا كان يحتوي على محتوى
  if (currSection.length > 0) {
    sections.push(currSection.join('\n').trim())
  }

  return sections.filter(Boolean)
}

/**
 * يقسم نص القسم إلى فقرات بواسطة السطر الجديد المزدوج
 * @param {string} text - نص القسم
 * @returns {string[]} - مصفوفة من الفقرات
 * @public
 * @example <caption>تقسيم القسم إلى فقرات</caption>
 * splitIntoParagraphs('# العنوان\n\nالفقرة الأولى.\n\nالفقرة الثانية.')
 * // ==> ['# العنوان', 'الفقرة الأولى.', 'الفقرة الثانية.']
 */
export function splitIntoParagraphs(text) {
  return text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
}

/**
 * يحلل فقرة واحدة بناءً على نوعها
 * @param {string} text - نص الفقرة
 * @returns {Paragraph} - الفقرة المحللة
 * @public
 * @example <caption>تحليل فقرة عنوان</caption>
 * parseParagraph('## عنواني')
 * // ==> { type: 'header', level: 2, content: { text: 'عنواني', formats: [] } }
 * @example <caption>تحليل فقرة نص مع تنسيق</caption>
 * parseParagraph('هذا نص **عريض** و *مائل*')
 * // ==> { type: 'text', content: { text: 'هذا نص عريض و مائل', formats: [...] } }
 */
export function parseParagraph(text) {
  const type = detectParagraphType(text)

  switch (type) {
    case 'header':
      return parseHeader(text)
    case 'quote':
      return parseQuote(text)
    case 'list':
      return parseList(text)
    case 'media':
      return parseMedia(text)
    case 'footnote':
      return parseFootnotes(text)
    case 'code':
      return parseCode(text)
    case 'table':
      return parseTable(text)
    case 'text':
    default:
      return parseText(text)
  }
}

/**
 * يحلل نص قسم إلى فقرات منظمة
 * @param {string} text - نص القسم
 * @returns {Paragraph[]} - مصفوفة من الفقرات المحللة
 * @public
 */
export function parseSection(text) {
  return splitIntoParagraphs(text).map(parseParagraph)
}

/**
 * يحلل نص الماركداون الكامل إلى تنسيق منظم
 * @param {string} text - نص الماركداون الكامل
 * @returns {Section[]} - مصفوفة من الأقسام، كل قسم يحتوي على مصفوفة من الفقرات المحللة
 * @public
 * @example <caption>تحليل وثيقة ماركداون كاملة</caption>
 * parseMarkdown('# العنوان\n\nالمحتوى\n\n---\n\n## العنوان الفرعي\n\nمحتوى أكثر')
 * // ==> [[headerParagraph, textParagraph], [headerParagraph, textParagraph]]
 */
export function parseMarkdown(text) {
  return splitIntoSections(text)
    .map(parseSection)
    .filter((s) => s.length > 0)
}
