import { equal } from 'assert/strict'
import { detectParagraphType } from '../../src/func/تحقق.js'

describe('تحقق.js', () => {
  describe('detectParagraphType()', () => {
    it('should detect header paragraphs', () => {
      equal(detectParagraphType('# Header 1'), 'header')
      equal(detectParagraphType('## Header 2'), 'header')
      equal(detectParagraphType('### Header 3'), 'header')
      equal(detectParagraphType('#### Header 4'), 'header')
      equal(detectParagraphType('##### Header 5'), 'header')
      equal(detectParagraphType('###### Header 6'), 'header')
    })

    it('should detect quote paragraphs', () => {
      equal(detectParagraphType('> This is a quote'), 'quote')
      equal(detectParagraphType('>> This is a nested quote'), 'quote')
    })

    it('should detect list paragraphs', () => {
      equal(detectParagraphType('- Bullet item'), 'list')
      equal(detectParagraphType('1. Numbered item'), 'list')
      equal(detectParagraphType('- [ ] Task item'), 'list')
      equal(detectParagraphType('- [x] Task item'), 'list')

      equal(detectParagraphType('* Bullet item'), 'text')
      equal(detectParagraphType('+ Bullet item'), 'text')
    })

    it('should detect media paragraphs', () => {
      equal(detectParagraphType('![](path/to/image.jpg)'), 'media')
      equal(detectParagraphType('![alt](path/to/video.mp4)'), 'media')
      equal(detectParagraphType('![*alt*](path/to/audio.mp3)'), 'media')
    })

    it('should detect footnote paragraphs', () => {
      equal(detectParagraphType('[^1]: Footnote content'), 'footnote')
    })

    it('should detect code paragraphs', () => {
      equal(detectParagraphType('```\n\n```'), 'code')
      equal(detectParagraphType('```javascript\nconsole.log();\n```'), 'code')
    })

    it('should detect table paragraphs', () => {
      equal(detectParagraphType('| Column 1 | Column 2 |'), 'table')
    })

    it('should detect text paragraphs as default', () => {
      equal(detectParagraphType(''), 'text')
      equal(detectParagraphType(' '), 'text')
      equal(detectParagraphType('Regular text paragraph'), 'text')
    })
  })
})
