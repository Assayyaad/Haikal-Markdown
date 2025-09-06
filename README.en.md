# Haikal Markdown

<div style="text-align: center;">

[![github](https://img.shields.io/badge/Assayyaad/Markdown--Haikal-000000?logo=github&logoColor=white)](https://www.github.com/Assayyaad/Haikal-Markdown)
[![npm](https://img.shields.io/badge/markdown--haikal-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/haikal-markdown)

![version](https://img.shields.io/npm/v/haikal-markdown.svg?label=latest&logo=npm)
![monthly downloads](https://img.shields.io/npm/dm/haikal-markdown.svg?logo=npm)

[![test](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/test.yml/badge.svg)](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/test.yml)
[![documentations](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/docs.yml/badge.svg)](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/docs.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

[العربية](./README.md)

</div>

A strict markdown format specification and parser for converting markdown content into structured, manipulable code representations.

**Note**: The syntax and format choices in this package are based on the standards explained in the [Markdown Guide](https://www.markdownguide.org). When multiple syntax options exist for the same markdown element, this package enforces one specific syntax to ensure consistency. The formatter will automatically convert any alternative valid markdown syntax to the chosen syntax enforced by this package.

- [Haikal Markdown](#haikal-markdown)
  - [Overview](#overview)
  - [Purpose](#purpose)
  - [Structure](#structure)
    - [Document Hierarchy](#document-hierarchy)
    - [Top-Level: Sections](#top-level-sections)
    - [Mid-Level: Paragraphs](#mid-level-paragraphs)
      - [Text Paragraphs](#text-paragraphs)
      - [Header Paragraphs](#header-paragraphs)
      - [List Paragraphs](#list-paragraphs)
      - [Media Paragraphs](#media-paragraphs)
      - [Footnotes Paragraphs](#footnotes-paragraphs)
      - [Quote Paragraphs](#quote-paragraphs)
      - [Code Paragraphs](#code-paragraphs)
      - [Table Paragraphs](#table-paragraphs)
    - [Text Formatting](#text-formatting)
  - [Future Plans](#future-plans)
    - [Platform-Specific Formatting](#platform-specific-formatting)
    - [Obsidian Plugin Support](#obsidian-plugin-support)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Rules Summary](#rules-summary)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

Haikal Markdown defines a rigid markdown structure that enables reliable parsing to code and back without data loss or formatting issues. The specification enforces consistent formatting rules that eliminate ambiguity in markdown interpretation.

## Purpose

- **Bidirectional Conversion**: Parse markdown to structured code representations and convert back to markdown
- **Consistent Structure**: Enforce strict formatting rules for predictable parsing
- **Easy Manipulation**: Enable programmatic manipulation of markdown content through structured data
- **Format Enforcement**: Automatically format any markdown content to comply with Haikal rules, converting alternative valid markdown syntax to the chosen standardized syntax

## Structure

### Document Hierarchy

```
Parsed Markdown File
├── path: string
└── sections: Section[]
    └── Section (Paragraph[])
        └── Paragraph (union type)
            ├── TextParagraph
            ├── HeaderParagraph (levels 1-6)
            ├── ListParagraph (bullet/number/task)
            ├── MediaParagraph (image/gif/video/audio)
            ├── FootnoteParagraph
            ├── QuoteParagraph (nested paragraphs)
            ├── CodeParagraph (syntax highlighted)
            └── TableParagraph (rows/cells)
```

### Top-Level: Sections

Documents are divided into sections separated by three dashes (`---`). Each section contains an array of paragraphs.

### Mid-Level: Paragraphs

Within each section, content is organized into paragraphs separated by exactly two newlines (`\n\n`). Each paragraph has a specific type and structure:

#### Text Paragraphs

```javascript
{
  type: 'text',
  content: { text: 'Raw text content' }
}
```

#### Header Paragraphs

```javascript
{
  type: 'header',
  level: 1,  // 1-6
  content: { text: 'Header Text' }
}
```

#### List Paragraphs

```javascript
{
  type: 'list',
  listType: 'bullet',  // 'bullet' | 'number' | 'task'
  contents: [
    { text: 'First item' },
    { text: 'Second item' }
  ]
}
```

#### Media Paragraphs

```javascript
{
  type: 'media',
  path: '/path/to/image.jpg',
  alt: 'Alt text',  // optional
  url: 'https://link-url.com',  // optional
  mediaType: 'image',  // optional: 'image' | 'gif' | 'video' | 'audio'
  extension: 'jpg'  // optional
}
```

#### Footnotes Paragraphs

```javascript
{
  type: 'footnote',
  list: [
    { number: 1, text: 'First reference' },
    { number: 2, text: 'Second reference' }
  ]
}
```

#### Quote Paragraphs

```javascript
{
  type: 'quote',
  paragraphs: [
    { type: 'text', content: { text: 'Quoted text' } }
  ]
}
```

#### Code Paragraphs

```javascript
{
  type: 'code',
  text: 'console.log("Bismi Allah");',
  language: 'javascript'  // optional: supported languages include 'c', 'cpp', 'csharp', 'java', 'javascript', 'python', 'ruby', 'go', 'rust'
}
```

#### Table Paragraphs

```javascript
{
  type: 'table',
  rows: [
    [
      { text: 'Header 1' },
      { text: 'Header 2' }
    ],
    [
      { text: 'Cell 1' },
      { text: 'Cell 2' }
    ]
  ]
}
```

### Text Formatting

All text content supports inline formatting with precise positioning:

- **bold** (`<strong>`)
- *italic* (`<em>`)
- ~~strikethrough~~ (`<del>`/`<s>`)
- ==highlight== (`<mark>`)
- `code` (`<code>`)
- ~subscript~ (`<sub>`)
- ^superscript^ (`<sup>`)

Formats are stored as ranges with start/end indices within the text.

## Future Plans

### Platform-Specific Formatting

Support for multiple [platform](https://www.markdownguide.org/tools) flavors by providing formatting that converts unsupported markdown syntax to plain text for specific platforms:

- **Obsidian** - Full markdown support with frontmatter
- **Discord** - Limited markdown with platform-specific formatting
- **GitLab** - GitLab-flavored markdown support
- **GitHub** - GitHub-flavored markdown support
- **WhatsApp** - Basic text formatting only

### Obsidian Plugin Support

- **JS Engine** - Support for JavaScript execution within Obsidian notes
- Additional plugin integrations as needed

## Features

- **Parser**: Converts Haikal-compliant markdown into structured data
- **Generator**: Converts structured data back to markdown
- **Formatter**: Enforces Haikal rules on any markdown content
- **Validator**: Checks compliance with Haikal specifications

## Installation

```bash
npm install haikal-markdown
```

## Usage

```javascript
import { parseMarkdown, serializeMarkdown } from 'haikal-markdown'

// Parse markdown to structure
const sections = parseMarkdown(markdownContent)

// Generate markdown from structure
const markdown = serializeMarkdown(sections)
```

For specific functionalities:

```javascript
// Import parsing functions
import { parseParagraph, parseSection } from 'haikal-markdown/parse'

// Import content manipulation functions
import {
  findHeaders,
  insertParagraphAt,
  removeSectionAt
} from 'haikal-markdown/content'

// Import types
import type { ParsedMarkdownFile, Section } from 'haikal-markdown/types'
```

## Rules Summary

1. Sections separated by exactly `---`
2. Paragraphs separated by exactly `\n\n`
3. Each paragraph must be a single, recognized type
4. No mixed content within paragraphs
5. Consistent indentation and spacing
6. Headers use ATX format only
7. Lists use consistent markers
8. Code blocks must be fenced

## Contributing

Contributions welcome! Please ensure all markdown follows Haikal specifications.

## License

This is free and unencumbered software released into the public domain.

For more information, please refer to [LICENSE](./LICENSE) or <https://unlicense.org>