import { equal, ok } from 'assert/strict'
import {
  fixSectionSeparators,
  fixParagraphSpacing,
  removeTrailingWhitespace,
  convertTabsToSpaces,
  normalizeHeader,
  normalizeList,
  normalizeQuote,
  normalizeCode,
  normalizeTable,
  fixTextFormatting,
  normalizeParagraph,
  fixDocumentStructure,
  formatMarkdown,
  autoCorrect,
  applyFormattingRule
} from '../../src/func/تنسيق.js'

describe('تنسيق.js', () => {
  describe('fixSectionSeparators()', () => {
    it('should fix long dash separators', () => {
      const text = 'Section 1\n-----\nSection 2'
      const result = fixSectionSeparators(text)
      equal(result, 'Section 1\n---\nSection 2')
    })

    it('should fix short dash separators', () => {
      const text = 'Section 1\n--\nSection 2'
      const result = fixSectionSeparators(text)
      equal(result, 'Section 1\n---\nSection 2')
    })

    it('should fix equals separators', () => {
      const text = 'Section 1\n====\nSection 2'
      const result = fixSectionSeparators(text)
      equal(result, 'Section 1\n---\nSection 2')
    })

    it('should leave correct separators unchanged', () => {
      const text = 'Section 1\n---\nSection 2'
      const result = fixSectionSeparators(text)
      equal(result, text)
    })
  })

  describe('fixParagraphSpacing', () => {
    it('should fix triple newlines to double', () => {
      const text = 'Paragraph 1\n\n\nParagraph 2'
      const result = fixParagraphSpacing(text)
      equal(result, 'Paragraph 1\n\nParagraph 2')
    })

    it('should fix multiple newlines to double', () => {
      const text = 'Para 1\n\n\n\n\nPara 2'
      const result = fixParagraphSpacing(text)
      equal(result, 'Para 1\n\nPara 2')
    })

    it('should fix spacing around section separators', () => {
      const text = 'Section 1\n\n\n---\n\n\nSection 2'
      const result = fixParagraphSpacing(text)
      equal(result, 'Section 1\n---\nSection 2')
    })

    it('should leave correct spacing unchanged', () => {
      const text = 'Para 1\n\nPara 2\n\n---\n\nSection 2'
      const result = fixParagraphSpacing(text)
      equal(result, text)
    })
  })

  describe('removeTrailingWhitespace', () => {
    it('should remove trailing spaces', () => {
      const text = 'Line with spaces   \nClean line\nAnother with tabs\t'
      const result = removeTrailingWhitespace(text)
      equal(result, 'Line with spaces\nClean line\nAnother with tabs')
    })

    it('should handle empty lines', () => {
      const text = 'Line 1\n   \nLine 3'
      const result = removeTrailingWhitespace(text)
      equal(result, 'Line 1\n\nLine 3')
    })

    it('should leave clean text unchanged', () => {
      const text = 'Clean line 1\nClean line 2'
      const result = removeTrailingWhitespace(text)
      equal(result, text)
    })
  })

  describe('convertTabsToSpaces', () => {
    it('should convert tabs to 4 spaces', () => {
      const text = 'Line with\ttab\there'
      const result = convertTabsToSpaces(text)
      equal(result, 'Line with    tab    here')
    })

    it('should leave spaces unchanged', () => {
      const text = 'Line with    spaces'
      const result = convertTabsToSpaces(text)
      equal(result, text)
    })
  })

  describe('normalizeHeader', () => {
    it('should normalize header with multiple spaces', () => {
      const header = '##   Header with extra spaces'
      const result = normalizeHeader(header)
      equal(result, '## Header with extra spaces')
    })

    it('should leave correct headers unchanged', () => {
      const header = '# Correct Header'
      const result = normalizeHeader(header)
      equal(result, header)
    })
  })

  describe('normalizeList', () => {
    it('should normalize bullet list spacing', () => {
      const list = '-   Item 1\n*  Item 2\n+    Item 3'
      const result = normalizeList(list)
      equal(result, '- Item 1\n- Item 2\n- Item 3')
    })

    it('should normalize numbered list', () => {
      const list = '1.  First\n5.   Second\n10.    Third'
      const result = normalizeList(list)
      equal(result, '1. First\n2. Second\n3. Third')
    })

    it('should normalize task list', () => {
      const list = '-  [ ] Task 1\n+   [x]  Done task\n*  [ ]   Another'
      const result = normalizeList(list)
      equal(result, '- [ ] Task 1\n- [x] Done task\n- [ ] Another')
    })
  })

  describe('normalizeQuote', () => {
    it('should normalize quote spacing', () => {
      const quote = '>Quote without space\n>  Quote with extra space'
      const result = normalizeQuote(quote)
      equal(result, '> Quote without space\n> Quote with extra space')
    })

    it('should leave correct quotes unchanged', () => {
      const quote = '> Correct quote\n> Another line'
      const result = normalizeQuote(quote)
      equal(result, quote)
    })
  })

  describe('normalizeCode', () => {
    it('should normalize fence length', () => {
      const code = '````javascript\ncode\n`````'
      const result = normalizeCode(code)
      equal(result, '```javascript\ncode\n```')
    })

    it('should leave correct fences unchanged', () => {
      const code = '```javascript\ncode\n```'
      const result = normalizeCode(code)
      equal(result, code)
    })
  })

  describe('normalizeTable', () => {
    it('should normalize table spacing', () => {
      const table = '|Col1|   Col2   |\n|Cell1|Cell2|'
      const result = normalizeTable(table)
      equal(result, '| Col1 | Col2 |\n| Cell1 | Cell2 |')
    })

    it('should handle tables with inconsistent spacing', () => {
      const table = '  | Col1  |Col2|  \n|  Cell1|  Cell2  |'
      const result = normalizeTable(table)
      equal(result, '| Col1 | Col2 |\n| Cell1 | Cell2 |')
    })
  })

  describe('fixTextFormatting', () => {
    it('should fix bold formatting', () => {
      const text = '***bold*** and ** spaced **'
      const result = fixTextFormatting(text)
      equal(result, '***bold*** and **spaced**')
    })

    it('should fix italic formatting', () => {
      const text = '* spaced italic *'
      const result = fixTextFormatting(text)
      equal(result, '*spaced italic*')
    })

    it('should fix strikethrough', () => {
      const text = '~~~strikethrough~~~ and ~single~'
      const result = fixTextFormatting(text)
      equal(result, '~~strikethrough~~ and ~~single~~')
    })

    it('should fix code formatting', () => {
      const text = '``code``'
      const result = fixTextFormatting(text)
      equal(result, '`code`')
    })

    it('should fix highlight formatting', () => {
      const text = '===highlight==='
      const result = fixTextFormatting(text)
      equal(result, '==highlight==')
    })
  })

  describe('normalizeParagraph', () => {
    it('should normalize based on detected type', () => {
      const header = '##   Spaced Header'
      const list = '-  List item'
      const quote = '>Quote'

      equal(normalizeParagraph(header), '## Spaced Header')
      equal(normalizeParagraph(list), '- List item')
      equal(normalizeParagraph(quote), '> Quote')
    })

    it('should fix text formatting for text paragraphs', () => {
      const text = 'Text with ***formatting***'
      const result = normalizeParagraph(text)
      equal(result, 'Text with ***formatting***')
    })
  })

  describe('fixDocumentStructure', () => {
    it('should remove empty sections', () => {
      const text = 'Section 1\n---\n\n---\nSection 3'
      const result = fixDocumentStructure(text)
      equal(result, 'Section 1\n\n---\n\nSection 3')
    })

    it('should handle document with only empty sections', () => {
      const text = '---\n\n---\n'
      const result = fixDocumentStructure(text)
      equal(result, '')
    })
  })

  describe('formatMarkdown', () => {
    it('should apply all formatting rules', () => {
      const markdown =
        '##   Header   \n\n\nText with ***bold***\n\n----\n\n-  List item'
      const result = formatMarkdown(markdown)
      const expected = '## Header\n\nText with ***bold***\n\n---\n\n- List item'
      equal(result, expected)
    })

    it('should handle complex formatting issues', () => {
      const markdown =
        '\t# Header\t\n\n\n\nParagraph with  trailing  \n\n\n-----\n\n\n>Quote\n\n```js\ncode\n````'
      const result = formatMarkdown(markdown)
      ok(!result.includes('\t'))
      ok(!result.includes('  \n'))
      ok(!result.includes('\n\n\n'))
      ok(result.includes('\n---\n'))
    })

    it('should preserve content while fixing format', () => {
      const markdown = '# Header\n\nContent'
      const result = formatMarkdown(markdown)
      ok(result.includes('Header'))
      ok(result.includes('Content'))
    })

    it('should handle empty input', () => {
      const result = formatMarkdown('')
      equal(result, '')
    })
  })

  describe('autoCorrect', () => {
    it('should be alias for formatMarkdown', () => {
      const markdown = '##  Header\n\n\nText'
      const formatResult = formatMarkdown(markdown)
      const autoResult = autoCorrect(markdown)
      equal(formatResult, autoResult)
    })
  })

  describe('applyFormattingRule', () => {
    it('should apply spacing rule', () => {
      const text = 'Para 1\n\n\nPara 2'
      const result = applyFormattingRule(text, 'spacing')
      equal(result, 'Para 1\n\nPara 2')
    })

    it('should apply headers rule', () => {
      const text = '##   Header'
      const result = applyFormattingRule(text, 'headers')
      equal(result, '## Header')
    })

    it('should apply lists rule', () => {
      const text = '-  Item 1\n-   Item 2'
      const result = applyFormattingRule(text, 'lists')
      equal(result, '- Item 1\n- Item 2')
    })

    it('should apply quotes rule', () => {
      const text = '>Quote\n>  Another'
      const result = applyFormattingRule(text, 'quotes')
      equal(result, '> Quote\n> Another')
    })

    it('should apply code rule', () => {
      const text = '````js\ncode\n`````'
      const result = applyFormattingRule(text, 'code')
      equal(result, '```js\ncode\n```')
    })

    it('should apply tables rule', () => {
      const text = '|Col1|Col2|\n|Cell1|Cell2|'
      const result = applyFormattingRule(text, 'tables')
      equal(result, '| Col1 | Col2 |\n| Cell1 | Cell2 |')
    })

    it('should apply formatting rule', () => {
      const text = 'Text with ***bold***'
      const result = applyFormattingRule(text, 'formatting')
      equal(result, 'Text with ***bold***')
    })

    it('should return unchanged text for unknown rule', () => {
      const text = 'Some text'
      // @ts-expect-error
      const result = applyFormattingRule(text, 'unknown')
      equal(result, text)
    })

    it('should handle empty text', () => {
      const result = applyFormattingRule('', 'spacing')
      equal(result, '')
    })
  })
})
