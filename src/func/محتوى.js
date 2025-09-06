/** @import { HeaderLevel, HeaderParagraph, Paragraph, ParagraphType, Section } from '../أنواع.js' */

import {
  parseMarkdown,
  serializeMarkdown,
  parseSection,
  serializeSection,
  parseParagraph
} from './تحليل.js'

/**
 * يتحقق من كون محتوى الماركداون فارغاً (لا توجد فقرات)
 * @param {string} content - نص محتوى الماركداون
 * @returns {boolean} - true إذا كان المحتوى فارغاً، false إذا كان يحتوي على فقرات
 * @public
 */
export function isEmpty(content) {
  const sections = parseMarkdown(content)
  return sections.length === 0 || sections.every((s) => s.length === 0)
}

/**
 * يحصل على عدد الأقسام في وثيقة ماركداون
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} [type] - نوع الفقرات المراد عدها
 * @returns {number} - عدد الأقسام
 * @public
 * @example <caption>عد جميع الأقسام</caption>
 * calcSectionCount('# العنوان 1\n\nنص\n\n---\n\n# العنوان 2\n\nنص أكثر')
 * // ترجع: 2
 * @example <caption>عد الأقسام التي تحتوي على عناوين</caption>
 * calcSectionCount('# العنوان 1\n\nنص\n\n---\n\nنص فقط', 'header')
 * // ترجع: 1
 */
export function calcSectionCount(content, type = undefined) {
  const sections = parseMarkdown(content)
  if (type) {
    return sections.filter((s) => s.some((p) => p.type === type)).length
  } else {
    return sections.length
  }
}

/**
 * يحصل على العدد الإجمالي للفقرات عبر جميع الأقسام
 * @param {string} content - نص محتوى القسم
 * @param {ParagraphType} [type] - نوع الفقرات المراد عدها
 * @returns {number} - العدد الإجمالي للفقرات
 * @public
 */
export function calcParagraphCount(content, type = undefined) {
  const paragraphs = parseSection(content)

  if (type) {
    return paragraphs.filter((p) => p.type === type).length
  } else {
    return paragraphs.length
  }
}

/**
 * يحصل على العدد الإجمالي للفقرات عبر جميع الأقسام
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} [type] - نوع الفقرات المراد عدها
 * @returns {number} - العدد الإجمالي للفقرات
 * @public
 * @example <caption>عد جميع الفقرات عبر الأقسام</caption>
 * calcTotalParagraphCount('# ع1\n\nنص\n\n---\n\n## ع2\n\nنص أكثر\n\nفقرة أخرى')
 * // ترجع: 5 (عنوان + نص + عنوان + نص + نص)
 * @example <caption>عد فقرات العناوين فقط</caption>
 * calcTotalParagraphCount('# ع1\n\nنص\n\n---\n\n## ع2\n\nنص أكثر', 'header')
 * // ترجع: 2
 */
export function calcTotalParagraphCount(content, type = undefined) {
  return parseMarkdown(content).reduce((total, s) => {
    if (type) {
      return total + s.filter((p) => p.type === type).length
    } else {
      return total + s.length
    }
  }, 0)
}

/**
 * يجد فهرس القسم الأول الذي يحتوي على فقرة من نوع معين
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} type
 * @returns {number} - فهرس القسم، أو -1 إذا لم يوجد
 * @public
 * @example <caption>العثور على أول قسم يحتوي على عنوان</caption>
 * findSectionIndexWithParagraphType('نص فقط\n\n---\n\n# عنوان\n\nنص', 'header')
 * // ترجع: 1
 */
export function findSectionIndexWithParagraphType(content, type) {
  return parseMarkdown(content).findIndex((s) => s.some((p) => p.type === type))
}

/**
 * يجد القسم الأول الذي يحتوي على فقرة من نوع معين
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} type - نوع الفقرات المراد البحث عنها
 * @returns {Section | undefined} - أول قسم يحتوي على فقرات من النوع المحدد، أو undefined إذا لم يوجد
 * @public
 */
export function findSectionWithParagraphType(content, type) {
  return parseMarkdown(content).find((s) => s.some((p) => p.type === type))
}

/**
 * يجد جميع الأقسام التي تحتوي على فقرات من نوع معين
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} type - نوع الفقرات المراد البحث عنها
 * @returns {Section[]} - مصفوفة من الأقسام التي تحتوي على فقرات من النوع المحدد
 * @public
 */
export function findSectionsWithParagraphType(content, type) {
  return parseMarkdown(content).filter((s) => s.some((p) => p.type === type))
}

/**
 * يحصل على أول فقرة من نوع معين من محتوى الماركداون
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} type - نوع الفقرة المراد البحث عنها
 * @returns {Paragraph | undefined} - أول فقرة من النوع المحدد، أو undefined إذا لم يوجد
 * @public
 */
export function findParagraphByType(content, type) {
  return parseMarkdown(content)
    .flat()
    .find((p) => p.type === type)
}

/**
 * يحصل على جميع الفقرات من نوع معين من محتوى الماركداون
 * @param {string} content - نص محتوى الماركداون
 * @param {ParagraphType} type - نوع الفقرات المراد البحث عنها
 * @returns {Paragraph[]} - مصفوفة من الفقرات من النوع المحدد
 * @public
 * @example <caption>العثور على جميع فقرات العناوين</caption>
 * findParagraphsByType('# H1\n\nText\n\n## H2\n\nMore text', 'header')
 * // ترجع: [{ type: 'header', level: 1, ... }, { type: 'header', level: 2, ... }]
 */
export function findParagraphsByType(content, type) {
  return parseMarkdown(content)
    .flat()
    .filter((p) => p.type === type)
}

/**
 * يحصل على جميع العناوين من محتوى الماركداون
 * @param {string} content - نص محتوى الماركداون
 * @returns {HeaderParagraph[]} - مصفوفة من فقرات العناوين
 * @example <caption>العثور على جميع العناوين</caption>
 * findHeaders('# H1\n\nText\n\n## H2\n\nMore text')
 * // ==> [{ type: 'header', level: 1, ... }, { type: 'header', level: 2, ... }]
 * @public
 */
export function findHeaders(content) {
  return /** @type {HeaderParagraph[]} */ (
    findParagraphsByType(content, 'header')
  )
}

/**
 * يحصل على العناوين حسب المستوى من محتوى الماركداون
 * @param {string} content - نص محتوى الماركداون
 * @param {HeaderLevel} level - مستوى العنوان المراد البحث عنه (1-6)
 * @returns {HeaderParagraph[]} - مصفوفة من فقرات العناوين التي تطابق المستوى
 * @public
 * @example <caption>العثور على جميع عناوين المستوى 2</caption>
 * findHeadersByLevel('# H1\n\n## H2a\n\n### H3\n\n## H2b', 2)
 * // ترجع: [{ type: 'header', level: 2, content: { text: 'H2a', formats: [] } }, ...]
 */
export function findHeadersByLevel(content, level) {
  return findHeaders(content).filter((h) => h.level === level)
}

/**
 * يستبدل قسماً في فهرس محدد
 * @param {string} content - نص محتوى الماركداون
 * @param {number} index - فهرس القسم المراد استبداله
 * @param {string} newContent - المحتوى الجديد للقسم كنص ماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 * @example <caption>استبدال القسم الثاني</caption>
 * replaceSectionAt('# S1\n\nText\n\n---\n\n# S2\n\nOld', 1, '# New Section\n\nNew content')
 * // ترجع: '# S1\n\nText\n\n---\n\n# New Section\n\nNew content'
 */
export function replaceSectionAt(content, index, newContent) {
  const sections = parseMarkdown(content)
  if (index < 0 || index >= sections.length) {
    throw new Error(`Index ${index} is out of bounds`)
  }
  const newSection = parseSection(newContent)
  const updatedSections = sections.map((s, i) => (i === index ? newSection : s))
  return serializeMarkdown(updatedSections)
}

/**
 * يستبدل القسم الأول
 * @param {string} content - نص محتوى الماركداون
 * @param {string} newContent - المحتوى الجديد للقسم كنص ماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function replaceFirstSection(content, newContent) {
  const sections = parseMarkdown(content)
  if (sections.length === 0) {
    throw new Error('No sections to replace')
  }
  return replaceSectionAt(content, 0, newContent)
}

/**
 * يستبدل القسم الأخير
 * @param {string} content - نص محتوى الماركداون
 * @param {string} newContent - المحتوى الجديد للقسم كنص ماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function replaceLastSection(content, newContent) {
  const sections = parseMarkdown(content)
  if (sections.length === 0) {
    throw new Error('No sections to replace')
  }
  return replaceSectionAt(content, sections.length - 1, newContent)
}

/**
 * يستبدل فقرة في فهرس محدد داخل قسم
 * @param {string} content - نص محتوى القسم
 * @param {number} index - فهرس الفقرة المراد استبدالها
 * @param {string} newContent - المحتوى الجديد للفقرة كنص ماركداون
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function replaceParagraphAt(content, index, newContent) {
  const section = parseSection(content)
  if (index < 0 || index >= section.length) {
    throw new Error(`Index ${index} is out of bounds`)
  }
  const newParagraph = parseParagraph(newContent)
  const updatedSection = section.map((p, i) => (i === index ? newParagraph : p))
  return serializeSection(updatedSection)
}

/**
 * يستبدل الفقرة الأولى في القسم
 * @param {string} content - نص محتوى القسم
 * @param {string} newContent - المحتوى الجديد للفقرة كنص ماركداون
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function replaceFirstParagraph(content, newContent) {
  const section = parseSection(content)
  if (section.length === 0) {
    throw new Error('No paragraphs to replace')
  }
  return replaceParagraphAt(content, 0, newContent)
}

/**
 * يستبدل الفقرة الأخيرة في القسم
 * @param {string} content - نص محتوى القسم
 * @param {string} newContent - المحتوى الجديد للفقرة كنص ماركداون
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function replaceLastParagraph(content, newContent) {
  const section = parseSection(content)
  if (section.length === 0) {
    throw new Error('No paragraphs to replace')
  }
  return replaceParagraphAt(content, section.length - 1, newContent)
}

/**
 * يدرج قسماً في فهرس محدد
 * @param {string} content - نص محتوى الماركداون
 * @param {number} index - الفهرس المراد إدراج القسم فيه
 * @param {string} newContent - المحتوى الجديد للقسم كنص ماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 * @example <caption>إدراج قسم بين الأقسام الموجودة</caption>
 * insertSectionAt('# S1\n\nText\n\n---\n\n# S3\n\nText', 1, '# S2\n\nMiddle section')
 * // ترجع: '# S1\n\nText\n\n---\n\n# S2\n\nMiddle section\n\n---\n\n# S3\n\nText'
 */
export function insertSectionAt(content, index, newContent) {
  const sections = parseMarkdown(content)
  if (index < 0 || index > sections.length) {
    throw new Error(`Index ${index} is out of bounds`)
  }
  const newSection = parseSection(newContent)
  const updatedSections = [
    ...sections.slice(0, index),
    newSection,
    ...sections.slice(index)
  ]
  return serializeMarkdown(updatedSections)
}

/**
 * يدرج قسماً في البداية
 * @param {string} content - نص محتوى الماركداون
 * @param {string} newContent - المحتوى الجديد للقسم كنص ماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function insertFirstSection(content, newContent) {
  return insertSectionAt(content, 0, newContent)
}

/**
 * يدرج قسماً في النهاية
 * @param {string} content - نص محتوى الماركداون
 * @param {string} newContent - المحتوى الجديد للقسم كنص ماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function insertLastSection(content, newContent) {
  const sections = parseMarkdown(content)
  return insertSectionAt(content, sections.length, newContent)
}

/**
 * يدرج فقرة في فهرس محدد داخل قسم
 * @param {string} content - نص محتوى القسم
 * @param {number} index - الفهرس المراد إدراج الفقرة فيه
 * @param {string} newContent - المحتوى الجديد للفقرة كنص ماركداون
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function insertParagraphAt(content, index, newContent) {
  const section = parseSection(content)
  if (index < 0 || index > section.length) {
    throw new Error(`Index ${index} is out of bounds`)
  }
  const newParagraph = parseParagraph(newContent)
  const updatedSection = [
    ...section.slice(0, index),
    newParagraph,
    ...section.slice(index)
  ]
  return serializeSection(updatedSection)
}

/**
 * يدرج فقرة في بداية القسم
 * @param {string} content - نص محتوى القسم
 * @param {string} newContent - المحتوى الجديد للفقرة كنص ماركداون
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function insertFirstParagraph(content, newContent) {
  return insertParagraphAt(content, 0, newContent)
}

/**
 * يدرج فقرة في نهاية القسم
 * @param {string} content - نص محتوى القسم
 * @param {string} newContent - المحتوى الجديد للفقرة كنص ماركداون
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function insertLastParagraph(content, newContent) {
  const section = parseSection(content)
  return insertParagraphAt(content, section.length, newContent)
}

/**
 * يحذف قسماً في فهرس محدد
 * @param {string} content - نص محتوى الماركداون
 * @param {number} index - فهرس القسم المراد حذفه
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function removeSectionAt(content, index) {
  const sections = parseMarkdown(content)
  if (index < 0 || index >= sections.length) {
    throw new Error(`Index ${index} is out of bounds`)
  }
  const updatedSections = sections.filter((_, i) => i !== index)
  return serializeMarkdown(updatedSections)
}

/**
 * يحذف القسم الأول
 * @param {string} content - نص محتوى الماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function removeFirstSection(content) {
  const sections = parseMarkdown(content)
  if (sections.length === 0) {
    throw new Error('No sections to remove')
  }
  return removeSectionAt(content, 0)
}

/**
 * يحذف القسم الأخير
 * @param {string} content - نص محتوى الماركداون
 * @returns {string} - محتوى الماركداون المعدّل
 * @public
 */
export function removeLastSection(content) {
  const sections = parseMarkdown(content)
  if (sections.length === 0) {
    throw new Error('No sections to remove')
  }
  return removeSectionAt(content, sections.length - 1)
}

/**
 * يحذف فقرة في فهرس محدد داخل قسم
 * @param {string} content - نص محتوى القسم
 * @param {number} index - فهرس الفقرة المراد حذفها
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function removeParagraphAt(content, index) {
  const section = parseSection(content)
  if (index < 0 || index >= section.length) {
    throw new Error(`Index ${index} is out of bounds`)
  }
  const updatedSection = section.filter((_, i) => i !== index)
  return serializeSection(updatedSection)
}

/**
 * يحذف الفقرة الأولى من القسم
 * @param {string} content - نص محتوى القسم
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function removeFirstParagraph(content) {
  const section = parseSection(content)
  if (section.length === 0) {
    throw new Error('No paragraphs to remove')
  }
  return removeParagraphAt(content, 0)
}

/**
 * يحذف الفقرة الأخيرة من القسم
 * @param {string} content - نص محتوى القسم
 * @returns {string} - محتوى القسم المعدّل
 * @public
 */
export function removeLastParagraph(content) {
  const section = parseSection(content)
  if (section.length === 0) {
    throw new Error('No paragraphs to remove')
  }
  return removeParagraphAt(content, section.length - 1)
}
