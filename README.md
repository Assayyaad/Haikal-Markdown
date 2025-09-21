# هيكل ماركداون

<div style="text-align: center;">

[![github](https://img.shields.io/badge/Assayyaad/Haikal--Markdown-000000?logo=github&logoColor=white)](https://www.github.com/Assayyaad/Haikal-Markdown)
[![npm](https://img.shields.io/badge/haikal--markdown-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/haikal-markdown)

![version](https://img.shields.io/npm/v/haikal-markdown.svg?label=latest&logo=npm)
![monthly downloads](https://img.shields.io/npm/dm/haikal-markdown.svg?logo=npm)

[![test](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/test.yml/badge.svg)](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/test.yml)
[![documentations](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/docs.yml/badge.svg)](https://github.com/Assayyaad/Haikal-Markdown/actions/workflows/docs.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

[English](./README.en.md)

</div>

مواصفات تنسيق صارمة ومحلل لتحويل محتوى ماركداون إلى تمثيلات كودية منظمة وقابلة للتلاعب.

**ملاحظة**: خيارات البنية والتنسيق في هذه الحزمة مبنية على المعايير الموضحة في [دليل ماركداون](https://www.markdownguide.org). عندما توجد خيارات متعددة لنفس عنصر ماركداون، تفرض هذه الحزمة بنية واحدة محددة لضمان الاتساق. المنسق سيحول تلقائياً أي بنية ماركداون صحيحة بديلة إلى البنية المختارة المفروضة من قبل هذه الحزمة

- [هيكل ماركداون](#هيكل-ماركداون)
  - [نظرة عامة](#نظرة-عامة)
  - [الهدف](#الهدف)
  - [البنية](#البنية)
    - [التسلسل الهرمي للوثيقة](#التسلسل-الهرمي-للوثيقة)
    - [المستوى الأعلى: الأقسام](#المستوى-الأعلى-الأقسام)
    - [المستوى الأوسط: الفقرات](#المستوى-الأوسط-الفقرات)
      - [فقرات النص](#فقرات-النص)
      - [فقرات العناوين](#فقرات-العناوين)
      - [فقرات القوائم](#فقرات-القوائم)
      - [فقرات الوسائط](#فقرات-الوسائط)
      - [فقرات الحواشي](#فقرات-الحواشي)
      - [فقرات الاقتباس](#فقرات-الاقتباس)
      - [فقرات الكود](#فقرات-الكود)
      - [فقرات الجداول](#فقرات-الجداول)
    - [تنسيق النص](#تنسيق-النص)
  - [الخطط المستقبلية](#الخطط-المستقبلية)
    - [التنسيق الخاص بالمنصات](#التنسيق-الخاص-بالمنصات)
    - [دعم إضافات Obsidian](#دعم-إضافات-obsidian)
  - [الميزات](#الميزات)
  - [التثبيت](#التثبيت)
  - [الاستخدام](#الاستخدام)
  - [ملخص القواعد](#ملخص-القواعد)
  - [المساهمة](#المساهمة)
  - [الترخيص](#الترخيص)

## نظرة عامة

ماركداون هيكل يحدد بنية ماركداون صارمة تمكن من التحليل الموثوق للكود والعكس دون فقدان البيانات أو مشاكل التنسيق. المواصفة تفرض قواعد تنسيق متسقة تزيل الغموض في تفسير ماركداون.

## الهدف

- **التحويل ثنائي الاتجاه**: تحليل ماركداون إلى تمثيلات كود منظمة وتحويله مرة أخرى إلى ماركداون
- **البنية المتسقة**: فرض قواعد تنسيق صارمة للتحليل القابل للتنبؤ
- **التعديل السهل**: تمكين التلاعب البرمجي لمحتوى ماركداون من خلال البيانات المنظمة
- **فرض التنسيق**: تنسيق أي محتوى ماركداون تلقائياً ليتوافق مع قواعد هيكل، مع تحويل البنية البديلة الصحيحة للماركداون إلى البنية المعيارية المختارة

## البنية

### التسلسل الهرمي للوثيقة

```
ParsedMarkdownFile
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

### المستوى الأعلى: الأقسام

الوثائق مقسمة إلى أقسام مفصولة بثلاث شرطات (`---`). كل قسم يحتوي على مصفوفة من الفقرات.

### المستوى الأوسط: الفقرات

داخل كل قسم، المحتوى منظم في فقرات مفصولة بالضبط بسطرين جديدين (`\n\n`). كل فقرة لها نوع وبنية محددة:

#### فقرات النص

```javascript
{
  type: 'text',
  content: {
    text: 'محتوى النص الخام',
    formats: [{ type: 'bold', start: 0, end: 4 }]
  }
}
```

#### فقرات العناوين

```javascript
{
  type: 'header',
  level: 1,  // 1-6
  content: { text: 'نص العنوان' }
}
```

#### فقرات القوائم

```javascript
{
  type: 'list',
  listType: 'bullet',  // 'bullet' | 'number' | 'task'
  contents: [
    { text: 'العنصر الأول' },
    { text: 'العنصر الثاني' }
  ]
}
```

#### فقرات الوسائط

```javascript
{
  type: 'media',
  path: '/path/to/image.jpg',
  alt: 'Alt text',  // اختيار
  url: 'https://link-url.com',  // اختيار
  mediaType: 'image',  // اختيار: 'image' | 'gif' | 'video' | 'audio'
  extension: 'jpg'  // اختيار
}
```

#### فقرات الحواشي

```javascript
{
  type: 'footnote',
  list: [
    { number: 1, text: 'المرجع الأول' },
    { number: 2, text: 'المرجع الثاني' }
  ]
}
```

#### فقرات الاقتباس

```javascript
{
  type: 'quote',
  paragraphs: [
    { type: 'text', content: { text: 'النص المقتبس' } }
  ]
}
```

#### فقرات الكود

```javascript
{
  type: 'code',
  language: 'javascript',  // اختياري: اللغات المدعومة تشمل 'c', 'cpp', 'csharp', 'java', 'javascript', 'python', 'ruby', 'go', 'rust'
  text: 'console.log("بسم الله");'
}
```

#### فقرات الجداول

```javascript
{
  type: 'table',
  rows: [
    [
      { text: 'العنوان 1' },
      { text: 'العنوان 2' }
    ],
    [
      { text: 'الخلية 1' },
      { text: 'الخلية 2' }
    ]
  ]
}
```

### تنسيق النص

جميع محتويات النص تدعم التنسيق المضمن بتحديد موقع دقيق:

- **غامق** (`<strong>`)
- *مائل* (`<em>`)
- ~~يتوسطه خط~~ (`<del>`/`<s>`)
- ==مميز== (`<mark>`)
- `كود` (`<code>`)
- ~منخفض~ (`<sub>`)
- ^مرتفع^ (`<sup>`)

التنسيقات محفوظة كنطاقات مع فهارس البداية والنهاية داخل النص.

## الخطط المستقبلية

### التنسيق الخاص بالمنصات

دعم نكهات متعددة [للمنصات](https://www.markdownguide.org/tools) من خلال توفير تنسيق يحول بنية ماركداون غير المدعومة إلى نص عادي للمنصات المحددة:

- **Obsidian** - دعم كامل للماركداون مع البيانات الوصفية
- **Discord** - ماركداون محدود مع تنسيق خاص بالمنصة
- **GitLab** - دعم ماركداون بنكهة GitLab
- **GitHub** - دعم ماركداون بنكهة GitHub
- **WhatsApp** - تنسيق النص الأساسي فقط

### دعم إضافات Obsidian

- **JS Engine** - دعم تنفيذ JavaScript داخل ملاحظات Obsidian
- تكاملات إضافية حسب الحاجة

## الميزات

- **المحلل**: يحول ماركداون المتوافق مع هيكل إلى بيانات منظمة
- **المولد**: يحول البيانات المنظمة مرة أخرى إلى ماركداون
- **المنسق**: يفرض قواعد هيكل على أي محتوى ماركداون
- **المدقق**: يفحص التوافق مع مواصفات هيكل

## التثبيت

```bash
npm install haikal-markdown
```

## الاستخدام

```javascript
import { parseMarkdown, serializeMarkdown } from 'haikal-markdown'

// تحليل ماركداون إلى بنية
const sections = parseMarkdown(markdownContent)

// توليد ماركداون من البنية
const markdown = serializeMarkdown(sections)
```

للوظائف المحددة:

```javascript
// استيراد دوال التحليل
import { parseParagraph, parseSection } from 'haikal-markdown/parse'

// استيراد دوال تعديل المحتوى
import {
  findHeaders,
  insertParagraphAt,
  removeSectionAt
} from 'haikal-markdown/content'

// استيراد الأنواع
import type { ParsedMarkdownFile, Section } from 'haikal-markdown/types'
```

## ملخص القواعد

1. الأقسام مفصولة بالضبط بـ `---`
2. الفقرات مفصولة بالضبط بـ `\n\n`
3. كل فقرة يجب أن تكون نوع واحد معترف به
4. لا محتوى مختلط داخل الفقرات
5. مسافات بادئة وتباعد متسق
6. العناوين تستخدم تنسيق ATX فقط
7. القوائم تستخدم علامات متسقة
8. كتل الكود يجب أن تكون محاطة بسياج

## المساهمة

المساهمات مرحب بها! يرجى التأكد من أن جميع ماركداون يتبع مواصفات هيكل.

## الترخيص

هذا برنامج حر وغير مقيد يُطلق في المجال العام.

لمزيد من المعلومات، يرجى الرجوع إلى [LICENSE](./LICENSE) أو <https://gitlab.com/-/snippets/4888680>