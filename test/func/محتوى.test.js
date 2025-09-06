/** @import { HeaderParagraph } from '../../src/أنواع.js' */

import { equal, throws } from 'assert/strict'
import {
  isEmpty,
  calcSectionCount,
  calcParagraphCount,
  calcTotalParagraphCount,
  findSectionIndexWithParagraphType,
  findSectionWithParagraphType,
  findSectionsWithParagraphType,
  findParagraphByType,
  findParagraphsByType,
  findHeaders,
  findHeadersByLevel,
  replaceSectionAt,
  replaceFirstSection,
  replaceLastSection,
  replaceParagraphAt,
  replaceFirstParagraph,
  replaceLastParagraph,
  insertSectionAt,
  insertFirstSection,
  insertLastSection,
  insertParagraphAt,
  insertFirstParagraph,
  insertLastParagraph,
  removeSectionAt,
  removeFirstSection,
  removeLastSection,
  removeParagraphAt,
  removeFirstParagraph,
  removeLastParagraph
} from '../../src/func/محتوى.js'
import { parseMarkdown, parseSection } from '../../src/func/تحليل.js'

describe('محتوى.js', () => {
  const sampleMarkdown =
    '# First Header\n\n---\n\nText content\n\n- Item\n\n---\n\n# Second Header\n\nMore text\n\n- Another item'
  const sampleSection = '# Header\n\nText content\n\n- List item'

  describe('isEmpty()', () => {
    it('should return true for empty markdown', () => {
      equal(isEmpty(''), true)
    })

    it('should return true for markdown with only whitespace', () => {
      equal(isEmpty('   \n\n  '), true)
    })

    it('should return false for markdown with content', () => {
      equal(isEmpty(sampleMarkdown), false)
    })
  })

  describe('calcSectionCount()', () => {
    it('should count all sections', () => {
      const count = calcSectionCount(sampleMarkdown)
      equal(count, 3)
    })

    it('should count sections with specific paragraph type', () => {
      const headerSections = calcSectionCount(sampleMarkdown, 'header')
      equal(headerSections, 2)
    })

    it('should return 0 for empty markdown', () => {
      const count = calcSectionCount('')
      equal(count, 0)
    })

    it('should return 0 for non-existent paragraph type', () => {
      const mediaSections = calcSectionCount(sampleMarkdown, 'media')
      equal(mediaSections, 0)
    })
  })

  describe('calcParagraphCount()', () => {
    it('should count all paragraphs in section', () => {
      const count = calcParagraphCount(sampleSection)
      equal(count, 3)
    })

    it('should count paragraphs of specific type', () => {
      const headerCount = calcParagraphCount(sampleSection, 'header')
      equal(headerCount, 1)
    })

    it('should return 0 for empty section', () => {
      const count = calcParagraphCount('')
      equal(count, 0)
    })
  })

  describe('calcTotalParagraphCount()', () => {
    it('should count total paragraphs across all sections', () => {
      const total = calcTotalParagraphCount(sampleMarkdown)
      equal(total, 6)
    })

    it('should count total paragraphs of specific type', () => {
      const headers = calcTotalParagraphCount(sampleMarkdown, 'header')
      equal(headers, 2)
    })

    it('should return 0 for empty markdown', () => {
      const total = calcTotalParagraphCount('')
      equal(total, 0)
    })
  })

  describe('findSectionIndexWithParagraphType()', () => {
    it('should find index of section with specific paragraph type', () => {
      const index = findSectionIndexWithParagraphType(sampleMarkdown, 'header')
      equal(index, 0)
    })

    it('should return -1 for non-existent paragraph type', () => {
      const index = findSectionIndexWithParagraphType(sampleMarkdown, 'media')
      equal(index, -1)
    })

    it('should find first occurrence when multiple sections match', () => {
      const index = findSectionIndexWithParagraphType(sampleMarkdown, 'text')
      equal(index, 1)
    })
  })

  describe('findSectionWithParagraphType()', () => {
    it('should find section with specific paragraph type', () => {
      const section = findSectionWithParagraphType(sampleMarkdown, 'header')
      equal(section !== undefined, true)
      if (section) {
        equal(section[0].type, 'header')
      }
    })

    it('should return undefined for non-existent paragraph type', () => {
      const section = findSectionWithParagraphType(sampleMarkdown, 'media')
      equal(section, undefined)
    })
  })

  describe('findSectionsWithParagraphType()', () => {
    it('should find all sections with specific paragraph type', () => {
      const sections = findSectionsWithParagraphType(sampleMarkdown, 'list')
      equal(sections.length, 2)
    })

    it('should return empty array for non-existent paragraph type', () => {
      const sections = findSectionsWithParagraphType(sampleMarkdown, 'media')
      equal(sections.length, 0)
    })
  })

  describe('findParagraphByType()', () => {
    it('should find first paragraph of specific type', () => {
      const paragraph = findParagraphByType(sampleMarkdown, 'header')
      equal(paragraph !== undefined, true)
      if (paragraph) {
        equal(paragraph.type, 'header')
      }
    })

    it('should return undefined for non-existent paragraph type', () => {
      const paragraph = findParagraphByType(sampleMarkdown, 'media')
      equal(paragraph, undefined)
    })
  })

  describe('findParagraphsByType()', () => {
    it('should get all paragraphs of specific type', () => {
      const headers = findParagraphsByType(sampleMarkdown, 'header')
      equal(headers.length, 2)
      equal(headers[0].type, 'header')
    })

    it('should return empty array for non-existent type', () => {
      const media = findParagraphsByType(sampleMarkdown, 'media')
      equal(media.length, 0)
    })
  })

  describe('findHeaders()', () => {
    it('should get all header paragraphs', () => {
      const headers = findHeaders(sampleMarkdown)
      equal(headers.length, 2)
      equal(
        headers.every((h) => h.type === 'header'),
        true
      )
    })
  })

  describe('findHeadersByLevel()', () => {
    it('should get headers by level', () => {
      const level1Headers = findHeadersByLevel(sampleMarkdown, 1)
      equal(level1Headers.length, 2)
      equal(
        level1Headers.every((h) => h.level === 1),
        true
      )
    })

    it('should return empty array for non-existent level', () => {
      const level6Headers = findHeadersByLevel(sampleMarkdown, 6)
      equal(level6Headers.length, 0)
    })
  })

  describe('replaceSectionAt()', () => {
    it('should replace section at specific index', () => {
      const newContent = '# Replacement Header\n\nReplacement content'
      const result = replaceSectionAt(sampleMarkdown, 1, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 3)
      equal(sections[1][0].type, 'header')
    })

    it('should throw error for out of bounds index', () => {
      throws(() => {
        replaceSectionAt(sampleMarkdown, 10, 'new content')
      }, /Index 10 is out of bounds/)
    })

    it('should throw error for negative index', () => {
      throws(() => {
        replaceSectionAt(sampleMarkdown, -1, 'new content')
      }, /Index -1 is out of bounds/)
    })
  })

  describe('replaceFirstSection()', () => {
    it('should replace the first section', () => {
      const newContent = '# New First Section\n\nNew content'
      const result = replaceFirstSection(sampleMarkdown, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 3)
      equal(sections[0][0].type, 'header')
    })

    it('should throw error for empty markdown', () => {
      throws(() => {
        replaceFirstSection('', 'new content')
      }, /No sections to replace/)
    })
  })

  describe('replaceLastSection()', () => {
    it('should replace the last section', () => {
      const newContent = '# New Last Section\n\nNew content'
      const result = replaceLastSection(sampleMarkdown, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 3)
      equal(sections[2][0].type, 'header')
    })

    it('should throw error for empty markdown', () => {
      throws(() => {
        replaceLastSection('', 'new content')
      }, /No sections to replace/)
    })
  })

  describe('replaceParagraphAt()', () => {
    it('should replace paragraph at specific index', () => {
      const newContent = '## New Header'
      const result = replaceParagraphAt(sampleSection, 0, newContent)
      const section = parseSection(result)
      equal(section.length, 3)
      equal(section[0].type, 'header')
      equal(section[0].level, 2)
    })

    it('should throw error for out of bounds index', () => {
      throws(() => {
        replaceParagraphAt(sampleSection, 10, 'new content')
      }, /Index 10 is out of bounds/)
    })
  })

  describe('replaceFirstParagraph()', () => {
    it('should replace the first paragraph', () => {
      const newContent = '## New First Paragraph'
      const result = replaceFirstParagraph(sampleSection, newContent)
      const section = parseSection(result)
      equal(section[0].type, 'header')
      equal(section[0].level, 2)
    })

    it('should throw error for empty section', () => {
      throws(() => {
        replaceFirstParagraph('', 'new content')
      }, /No paragraphs to replace/)
    })
  })

  describe('replaceLastParagraph()', () => {
    it('should replace the last paragraph', () => {
      const newContent = '- New last item'
      const result = replaceLastParagraph(sampleSection, newContent)
      const section = parseSection(result)
      equal(section[section.length - 1].type, 'list')
    })

    it('should throw error for empty section', () => {
      throws(() => {
        replaceLastParagraph('', 'new content')
      }, /No paragraphs to replace/)
    })
  })

  describe('insertSectionAt()', () => {
    it('should insert section at specific index', () => {
      const newContent = '# Inserted Section\n\nInserted content'
      const result = insertSectionAt(sampleMarkdown, 1, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 4)
      equal(sections[1][0].type, 'header')
    })

    it('should insert at beginning when index is 0', () => {
      const newContent = '# First Section\n\nFirst content'
      const result = insertSectionAt(sampleMarkdown, 0, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 4)
    })

    it('should throw error for out of bounds index', () => {
      throws(() => {
        insertSectionAt(sampleMarkdown, 10, 'new content')
      }, /Index 10 is out of bounds/)
    })
  })

  describe('insertFirstSection()', () => {
    it('should insert section at the beginning', () => {
      const newContent = '# First Section\n\nFirst content'
      const result = insertFirstSection(sampleMarkdown, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 4)
      equal(sections[0][0].type, 'header')
    })

    it('should work with empty markdown', () => {
      const newContent = '# Only Section\n\nOnly content'
      const result = insertFirstSection('', newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 1)
    })
  })

  describe('insertLastSection()', () => {
    it('should insert section at the end', () => {
      const newContent = '# Last Section\n\nLast content'
      const result = insertLastSection(sampleMarkdown, newContent)
      const sections = parseMarkdown(result)
      equal(sections.length, 4)
      equal(sections[3][0].type, 'header')
    })
  })

  describe('insertParagraphAt()', () => {
    it('should insert paragraph at specific index', () => {
      const newContent = 'Inserted text paragraph'
      const result = insertParagraphAt(sampleSection, 1, newContent)
      const section = parseSection(result)
      equal(section.length, 4)
      equal(section[1].type, 'text')
    })

    it('should throw error for out of bounds index', () => {
      throws(() => {
        insertParagraphAt(sampleSection, 10, 'new content')
      }, /Index 10 is out of bounds/)
    })
  })

  describe('insertFirstParagraph()', () => {
    it('should insert paragraph at the beginning', () => {
      const newContent = 'First inserted paragraph'
      const result = insertFirstParagraph(sampleSection, newContent)
      const section = parseSection(result)
      equal(section.length, 4)
      equal(section[0].type, 'text')
    })
  })

  describe('insertLastParagraph()', () => {
    it('should insert paragraph at the end', () => {
      const newContent = 'Last inserted paragraph'
      const result = insertLastParagraph(sampleSection, newContent)
      const section = parseSection(result)
      equal(section.length, 4)
      equal(section[3].type, 'text')
    })
  })

  describe('removeSectionAt()', () => {
    it('should remove section at specific index', () => {
      const result = removeSectionAt(sampleMarkdown, 1)
      const sections = parseMarkdown(result)
      equal(sections.length, 2)
    })

    it('should throw error for out of bounds index', () => {
      throws(() => {
        removeSectionAt(sampleMarkdown, 10)
      }, /Index 10 is out of bounds/)
    })
  })

  describe('removeFirstSection()', () => {
    it('should remove the first section', () => {
      const result = removeFirstSection(sampleMarkdown)
      const sections = parseMarkdown(result)
      equal(sections.length, 2)
    })

    it('should throw error for empty markdown', () => {
      throws(() => {
        removeFirstSection('')
      }, /No sections to remove/)
    })
  })

  describe('removeLastSection()', () => {
    it('should remove the last section', () => {
      const result = removeLastSection(sampleMarkdown)
      const sections = parseMarkdown(result)
      equal(sections.length, 2)
    })

    it('should throw error for empty markdown', () => {
      throws(() => {
        removeLastSection('')
      }, /No sections to remove/)
    })
  })

  describe('removeParagraphAt()', () => {
    it('should remove paragraph at specific index', () => {
      const result = removeParagraphAt(sampleSection, 1)
      const section = parseSection(result)
      equal(section.length, 2)
    })

    it('should throw error for out of bounds index', () => {
      throws(() => {
        removeParagraphAt(sampleSection, 10)
      }, /Index 10 is out of bounds/)
    })
  })

  describe('removeFirstParagraph()', () => {
    it('should remove the first paragraph', () => {
      const result = removeFirstParagraph(sampleSection)
      const section = parseSection(result)
      equal(section.length, 2)
      equal(section[0].type, 'text')
    })

    it('should throw error for empty section', () => {
      throws(() => {
        removeFirstParagraph('')
      }, /No paragraphs to remove/)
    })
  })

  describe('removeLastParagraph()', () => {
    it('should remove the last paragraph', () => {
      const result = removeLastParagraph(sampleSection)
      const section = parseSection(result)
      equal(section.length, 2)
      equal(section[1].type, 'text')
    })

    it('should throw error for empty section', () => {
      throws(() => {
        removeLastParagraph('')
      }, /No paragraphs to remove/)
    })
  })
})
