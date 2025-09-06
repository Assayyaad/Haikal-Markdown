/** @import { ParagraphType } from '../أنواع.js' */

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
