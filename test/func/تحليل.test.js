/** @import { CodeParagraph, FootnoteParagraph, HeaderParagraph, ListParagraph, MediaParagraph, ParagraphContent, QuoteParagraph, Section, TableParagraph, TextFormat, TextParagraph } from '../../src/أنواع.js' */

import { deepEqual, equal } from 'assert/strict'
import {
  extractTextFormats,
  applyTextFormats,
  parseText,
  parseHeader,
  parseList,
  parseMedia,
  parseFootnotes,
  parseQuote,
  parseCode,
  parseTable,
  serializeParagraphContent,
  serializeParagraph,
  serializeSection,
  serializeMarkdown,
  splitIntoSections,
  splitIntoParagraphs,
  parseParagraph,
  parseSection,
  parseMarkdown
} from '../../src/func/تحليل.js'
import { throws } from 'assert'

describe('تحليل.js', () => {
  describe('extractTextFormats()', () => {
    it('should extract bold formatting', () => {
      const { text, formats } = extractTextFormats('This is **bold** text')
      equal(text, 'This is bold text')
      deepEqual(formats, [
        {
          type: 'bold',
          start: 8,
          end: 12
        }
      ])
    })

    it('should extract italic formatting', () => {
      const { text, formats } = extractTextFormats('This is *italic* text')
      equal(text, 'This is italic text')
      deepEqual(formats, [
        {
          type: 'italic',
          start: 8,
          end: 14
        }
      ])
    })

    it('should extract inline code formatting', () => {
      const { text, formats } = extractTextFormats('This is `inline code` text')
      equal(text, 'This is inline code text')
      deepEqual(formats, [
        {
          type: 'code',
          start: 8,
          end: 19
        }
      ])
    })

    it('should extract strikethrough formatting', () => {
      const { text, formats } = extractTextFormats(
        'This is ~~strikethrough~~ text'
      )
      equal(text, 'This is strikethrough text')
      deepEqual(formats, [
        {
          type: 'strikethrough',
          start: 8,
          end: 21
        }
      ])
    })

    it('should extract highlight formatting', () => {
      const { text, formats } = extractTextFormats('This is ==highlight== text')
      equal(text, 'This is highlight text')
      deepEqual(formats, [
        {
          type: 'highlight',
          start: 8,
          end: 17
        }
      ])
    })

    it('should extract multiple formatting types', () => {
      const { text, formats } = extractTextFormats(
        '**bold** and *italic* and `code`'
      )
      equal(text, 'bold and italic and code')
      deepEqual(formats, [
        {
          type: 'bold',
          start: 0,
          end: 4
        },
        {
          type: 'italic',
          start: 9,
          end: 15
        },
        {
          type: 'code',
          start: 20,
          end: 24
        }
      ])
    })

    it('should handle text without formatting', () => {
      const { text, formats } = extractTextFormats('Plain text')
      equal(text, 'Plain text')
      deepEqual(formats, [])
    })
  })

  describe('applyTextFormats()', () => {
    it('should apply single format', () => {
      /** @type {TextFormat[]} */
      const formats = [{ type: 'bold', start: 0, end: 4 }]
      const result = applyTextFormats('bold text', formats)
      equal(result, '**bold** text')
    })

    it('should apply multiple formats', () => {
      /** @type {TextFormat[]} */
      const formats = [
        { type: 'bold', start: 0, end: 4 },
        { type: 'italic', start: 5, end: 9 }
      ]
      const result = applyTextFormats('bold text', formats)
      equal(result, '**bold** *text*')
    })

    it('should handle nested formats correctly', () => {
      /** @type {TextFormat[]} */
      const formats = [
        { type: 'bold', start: 0, end: 9 },
        { type: 'italic', start: 5, end: 9 }
      ]
      const result = applyTextFormats('bold text', formats)
      equal(result, '**bold *text***')
    })

    it('should return original text with no formats', () => {
      const result = applyTextFormats('plain text', [])
      equal(result, 'plain text')
    })
  })

  describe('parseText()', () => {
    it('should parse plain text', () => {
      const result = parseText('Simple text paragraph')
      equal(result.type, 'text')
      equal(result.content.text, 'Simple text paragraph')
      deepEqual(result.content.formats, [])
    })

    it('should parse text with formatting', () => {
      const { type, content } = parseText('Text with **bold** content')
      equal(type, 'text')
      equal(content.text, 'Text with bold content')
      equal(content.formats.length, 1)
    })
  })

  describe('parseHeader()', () => {
    it('should parse header with level and content', () => {
      const { type, level, content } = parseHeader('## Header Text')
      equal(type, 'header')
      equal(level, 2)
      equal(content.text, 'Header Text')
    })

    it('should parse header with formatting', () => {
      const { type, level, content } = parseHeader('# **Bold** Header')
      equal(type, 'header')
      equal(level, 1)
      equal(content.text, 'Bold Header')
      equal(content.formats.length, 1)
      equal(content.formats[0].type, 'bold')
    })
  })

  describe('parseList()', () => {
    it('should parse bullet list', () => {
      const { type, listType, contents } = parseList('- Item 1\n- Item 2')
      equal(type, 'list')
      equal(listType, 'bullet')
      equal(contents.length, 2)
      equal(contents[0].text, 'Item 1')
      equal(contents[1].text, 'Item 2')
    })

    it('should parse numbered list', () => {
      const { type, listType } = parseList('1. Item 1\n2. Item 2')
      equal(type, 'list')
      equal(listType, 'number')
    })

    it('should parse task list', () => {
      const { type, listType } = parseList('- [ ] Todo item\n- [x] Done item')
      equal(type, 'list')
      equal(listType, 'task')
    })
  })

  describe('parseMedia()', () => {
    it('should parse image media', () => {
      const { type, mediaType, path, alt, extension } = parseMedia(
        '![Alt text](path/to/image.jpg)'
      )
      equal(type, 'media')
      equal(mediaType, 'image')
      equal(path, 'path/to/image.jpg')
      equal(alt, 'Alt text')
      equal(extension, 'jpg')
    })

    it('should detect gif media type', () => {
      const { mediaType } = parseMedia(
        '![Animation](https://example.com/animation.gif)'
      )
      equal(mediaType, 'gif')
    })

    it('should detect video media type', () => {
      const { mediaType } = parseMedia('![Video](path/to/video.mp4)')
      equal(mediaType, 'video')
    })

    it('should detect audio media type', () => {
      const { mediaType } = parseMedia('![Audio](path/to/audio.mp3)')
      equal(mediaType, 'audio')
    })

    it('should detect media with url', () => {
      const { url } = parseMedia(
        '[![Audio](path/to/audio.mp3)](https://example.com/audio)'
      )
      equal(url, 'https://example.com/audio')
    })

    it('should detect minimum media type', () => {
      const { type, mediaType, path, alt, extension } = parseMedia(
        '![](https://example.com/image)'
      )
      equal(type, 'media')
      equal(mediaType, undefined)
      equal(path, 'https://example.com/image')
      equal(alt, undefined)
      equal(extension, undefined)
    })
  })

  describe('parseFootnotes()', () => {
    it('should parse single footnote', () => {
      const { type, list } = parseFootnotes('[^1]: This is a footnote')
      equal(type, 'footnote')
      equal(list.length, 1)
      equal(list[0].number, 1)
      equal(list[0].text, 'This is a footnote')
    })

    it('should parse multiple footnotes', () => {
      const { type, list } = parseFootnotes(
        '[^1]: First footnote\n[^2]: Second footnote'
      )
      equal(type, 'footnote')
      equal(list.length, 2)

      const [first, second] = list
      equal(first.number, 1)
      equal(first.text, 'First footnote')

      equal(second.number, 2)
      equal(second.text, 'Second footnote')
    })

    it("shouldn't parse empty footnote", () => {
      throws(() => parseFootnotes('[^]: A footnote'))
    })
  })

  describe('parseQuote()', () => {
    it('should parse simple quote', () => {
      const { type, paragraphs } = parseQuote('> This is a quote')
      equal(type, 'quote')
      equal(paragraphs.length, 1)
      equal(paragraphs[0].type, 'text')
      equal(paragraphs[0].content.text, 'This is a quote')
    })

    it('should parse multi-line quote', () => {
      const { type, paragraphs } = parseQuote('> Line 1\n>\n> Line 2')
      equal(type, 'quote')
      equal(paragraphs.length, 2)
      equal(paragraphs[0].type, 'text')
      equal(paragraphs[0].content.text, 'Line 1')
      equal(paragraphs[1].type, 'text')
      equal(paragraphs[1].content.text, 'Line 2')
    })
  })

  describe('parseCode()', () => {
    it('should parse code block with language', () => {
      const { type, language, text } = parseCode(
        '```javascript\nconsole.log("Hello");\n```'
      )
      equal(type, 'code')
      equal(language, 'javascript')
      equal(text, 'console.log("Hello");')
    })

    it('should default to javascript when no language specified', () => {
      const { language, text } = parseCode('```\nsome code\n```')
      equal(language, undefined)
      equal(text, 'some code')
    })
  })

  describe('parseTable()', () => {
    it('should parse table with headers and rows', () => {
      const tableText =
        '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
      const { type, rows } = parseTable(tableText)
      equal(type, 'table')
      equal(rows.length, 2)
      equal(rows[0].length, 2)
      equal(rows[0][0].text, 'Header 1')
      equal(rows[1][1].text, 'Cell 2')
    })
  })

  describe('serializeParagraphContent', () => {
    it('should serialize content with formats', () => {
      /** @type {ParagraphContent} */
      const content = {
        text: 'bold text',
        formats: [{ type: 'bold', start: 0, end: 4 }]
      }
      const result = serializeParagraphContent(content)
      equal(result, '**bold** text')
    })

    it('should serialize plain content', () => {
      /** @type {ParagraphContent} */
      const content = { text: 'plain text', formats: [] }
      const result = serializeParagraphContent(content)
      equal(result, 'plain text')
    })
  })

  describe('serializeParagraph', () => {
    it('should serialize header paragraph', () => {
      /** @type {HeaderParagraph} */
      const paragraph = {
        type: 'header',
        level: 2,
        content: { text: 'Header', formats: [] }
      }
      const result = serializeParagraph(paragraph)
      equal(result, '## Header')
    })

    it('should serialize text paragraph', () => {
      /** @type {TextParagraph} */
      const paragraph = {
        type: 'text',
        content: { text: 'Text content', formats: [] }
      }
      const result = serializeParagraph(paragraph)
      equal(result, 'Text content')
    })

    it('should serialize bullet list paragraph', () => {
      /** @type {ListParagraph} */
      const paragraph = {
        type: 'list',
        listType: 'bullet',
        contents: [
          { text: 'Item 1', formats: [] },
          { text: 'Item 2', formats: [] }
        ]
      }
      const result = serializeParagraph(paragraph)
      equal(result, '- Item 1\n- Item 2')
    })

    it('should serialize numbered list paragraph', () => {
      /** @type {ListParagraph} */
      const paragraph = {
        type: 'list',
        listType: 'number',
        contents: [
          { text: 'First', formats: [] },
          { text: 'Second', formats: [] }
        ]
      }
      const result = serializeParagraph(paragraph)
      equal(result, '1. First\n2. Second')
    })

    it('should serialize task list paragraph', () => {
      /** @type {ListParagraph} */
      const paragraph = {
        type: 'list',
        listType: 'task',
        contents: [
          { text: 'Todo', formats: [] },
          { text: 'Done', formats: [] }
        ]
      }
      const result = serializeParagraph(paragraph)
      equal(result, '- [ ] Todo\n- [ ] Done')
    })

    it('should serialize media paragraph', () => {
      /** @type {MediaParagraph} */
      const paragraph = {
        type: 'media',
        mediaType: 'image',
        path: 'image.jpg',
        alt: 'Alt text'
      }
      const result = serializeParagraph(paragraph)
      equal(result, '![Alt text](image.jpg)')
    })

    it('should serialize footnote paragraph', () => {
      /** @type {FootnoteParagraph} */
      const paragraph = {
        type: 'footnote',
        list: [
          { number: 1, text: 'Footnote text' },
          { number: 2, text: 'Footnote text' }
        ]
      }
      const result = serializeParagraph(paragraph)
      equal(result, '[^1]: Footnote text\n[^2]: Footnote text')
    })

    it('should serialize quote paragraph', () => {
      /** @type {QuoteParagraph} */
      const paragraph = {
        type: 'quote',
        paragraphs: [
          {
            type: 'text',
            content: { text: 'Quoted text', formats: [] }
          }
        ]
      }
      const result = serializeParagraph(paragraph)
      equal(result, '> Quoted text')
    })

    it('should serialize code paragraph', () => {
      /** @type {CodeParagraph} */
      const paragraph = {
        type: 'code',
        language: 'javascript',
        text: 'console.log("Hello");'
      }
      const result = serializeParagraph(paragraph)
      equal(result, '```javascript\nconsole.log("Hello");\n```')
    })

    it('should serialize table paragraph', () => {
      /** @type {TableParagraph} */
      const paragraph = {
        type: 'table',
        rows: [
          [
            { text: 'Header 1', formats: [] },
            { text: 'Header 2', formats: [] }
          ],
          [
            { text: 'Cell 1', formats: [] },
            { text: 'Cell 2', formats: [] }
          ]
        ]
      }
      const result = serializeParagraph(paragraph)
      equal(result, '| Header 1 | Header 2 |\n| Cell 1 | Cell 2 |')
    })
  })

  describe('serializeSection', () => {
    it('should serialize section with multiple paragraphs', () => {
      /** @type {Section} */
      const section = [
        {
          type: 'header',
          level: 1,
          content: { text: 'Header', formats: [] }
        },
        {
          type: 'text',
          content: { text: 'Text content', formats: [] }
        }
      ]
      const result = serializeSection(section)
      equal(result, '# Header\n\nText content')
    })
  })

  describe('serializeMarkdown', () => {
    it('should serialize complete parsed markdown', () => {
      /** @type {Section[]} */
      const sections = [
        [
          {
            type: 'header',
            level: 1,
            content: { text: 'Section 1', formats: [] }
          }
        ],
        [
          {
            type: 'text',
            content: { text: 'Section 2 content', formats: [] }
          }
        ]
      ]
      const result = serializeMarkdown(sections)
      equal(result, '# Section 1\n\n---\n\nSection 2 content')
    })

    it('should handle single section', () => {
      /** @type {Section[]} */
      const sections = [
        [
          {
            type: 'text',
            content: { text: 'Only content', formats: [] }
          }
        ]
      ]
      const result = serializeMarkdown(sections)
      equal(result, 'Only content')
    })
  })

  describe('splitIntoSections()', () => {
    it('should split text into sections by triple dash', () => {
      const text = 'Section 1\n---\nSection 2\n---\nSection 3'
      const sections = splitIntoSections(text)
      deepEqual(sections, ['Section 1', 'Section 2', 'Section 3'])
    })

    it('should handle single section', () => {
      const text = 'Only section'
      const sections = splitIntoSections(text)
      deepEqual(sections, ['Only section'])
    })
  })

  describe('splitIntoParagraphs()', () => {
    it('should split section into paragraphs by double newline', () => {
      const text = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3'
      const paragraphs = splitIntoParagraphs(text)
      deepEqual(paragraphs, ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'])
    })

    it('should handle single paragraph', () => {
      const text = 'Only paragraph'
      const paragraphs = splitIntoParagraphs(text)
      deepEqual(paragraphs, ['Only paragraph'])
    })
  })

  describe('parseParagraph()', () => {
    it('should parse paragraph based on detected type', () => {
      const header = parseParagraph('# Header')
      const text = parseParagraph('Regular text')
      const list = parseParagraph('- List item')

      equal(header.type, 'header')
      equal(text.type, 'text')
      equal(list.type, 'list')
    })
  })

  describe('parseSection()', () => {
    it('should parse section with multiple paragraphs', () => {
      const sectionText = '# Header\n\nRegular text\n\n- List item'
      const result = parseSection(sectionText)
      equal(result.length, 3)
      equal(result[0].type, 'header')
      equal(result[1].type, 'text')
      equal(result[2].type, 'list')
    })
  })

  describe('parseMarkdown()', () => {
    it('should parse complete markdown document', () => {
      const markdown =
        '# Section 1\n\nText content\n\n---\n\n## Section 2\n\n- List item'
      const sections = parseMarkdown(markdown)

      equal(sections.length, 2)
      equal(sections[0].length, 2)
      equal(sections[1].length, 2)
    })

    it('should handle single section document', () => {
      const markdown = '# Header\n\nText content'
      const sections = parseMarkdown(markdown)

      equal(sections.length, 1)
      equal(sections[0].length, 2)
    })

    it('should handle empty markdown', () => {
      const sections = parseMarkdown('')
      equal(sections.length, 0)
    })

    it('should handle markdown with only sections separators', () => {
      const sections = parseMarkdown('---\n\n---')
      equal(sections.length, 0)
    })
  })
})
