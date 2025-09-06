export {}

/**
 * مصفوفة من الفقرات التي تشكل قسماً
 * @typedef {Paragraph[]} Section
 */

/**
 * نوع موحد لجميع أنواع الفقرات
 * @typedef {TextParagraph | HeaderParagraph | ListParagraph | MediaParagraph | FootnoteParagraph | QuoteParagraph | CodeParagraph | TableParagraph} Paragraph
 */

/**
 * أنواع الفقرات المتاحة
 * @typedef {'text' | 'header' | 'list' | 'media' | 'footnote' | 'quote' | 'code' | 'table'} ParagraphType
 */

/**
 * فقرة نصية تحتوي على محتوى منسق
 * @typedef {Object} TextParagraph
 * @property {ParagraphType & 'text'} type - نوع الفقرة
 * @property {ParagraphContent} content - المحتوى النصي
 */

/**
 * مستويات العناوين المدعومة في الماركداون
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} HeaderLevel
 */

/**
 * فقرة عنوان مع المستوى والمحتوى
 * @typedef {Object} HeaderParagraph
 * @property {ParagraphType & 'header'} type - نوع الفقرة
 * @property {HeaderLevel} level - مستوى العنوان من 1 إلى 6
 * @property {ParagraphContent} content - محتوى العنوان
 */

/**
 * أنواع القوائم المتاحة
 * @typedef {'bullet' | 'number' | 'task'} ListType
 */

/**
 * فقرة قائمة تحتوي على عناصر متعددة
 * @typedef {Object} ListParagraph
 * @property {ParagraphType & 'list'} type - نوع الفقرة
 * @property {ListType} listType - نوع القائمة، إما نقطية أو مرقمة أو مهام
 * @property {ParagraphContent[]} contents - محتويات القائمة
 */

/**
 * أنواع الوسائط المدعومة
 * @typedef {'image' | 'gif' | 'video' | 'audio'} MediaType
 */

/**
 * امتدادات ملفات الوسائط المدعومة
 * @typedef {'png' | 'jpg' | 'jpeg' | 'gif' | 'webp' | 'mp4' | 'webm' | 'avi' | 'mov' | 'mp3' | 'wav' | 'ogg' | 'flac'} MediaExtension
 */

/**
 * فقرة وسائط للصور والفيديوهات وغيرها
 * @typedef {Object} MediaParagraph
 * @property {ParagraphType & 'media'} type - نوع الفقرة
 * @property {string} path - مسار ملف الوسائط، محلياً أو على الويب
 * @property {string} [alt] - النص البديل للوسائط
 * @property {string} [url] - الرابط المحيط بالوسائط، إذا كانت قابلة للنقر
 * @property {MediaType} [mediaType] - نوع الوسائط، إما صورة أو gif أو فيديو أو صوت
 * @property {MediaExtension} [extension] - امتداد ملف الوسائط
 */

/**
 * تعريف الحاشية مع الرقم والمحتوى
 * @typedef {object} Footnote
 * @property {number} number - رقم الحاشية
 * @property {string} text - نص الحاشية
 */

/**
 * فقرة حاشية مع مرجع مرقم
 * @typedef {Object} FootnoteParagraph
 * @property {ParagraphType & 'footnote'} type - نوع الفقرة
 * @property {Footnote[]} list - الحواشي
 */

/**
 * فقرة اقتباس تحتوي على فقرات متداخلة
 * @typedef {Object} QuoteParagraph
 * @property {ParagraphType & 'quote'} type - نوع الفقرة
 * @property {Paragraph[]} paragraphs - فقرات الاقتباس
 */

/**
 * لغات البرمجة المدعومة لتمييز الصيغة
 * @typedef {'c' | 'cpp' | 'csharp' | 'java' | 'javascript' | 'python' | 'ruby' | 'go' | 'rust'} CodingLanguages
 */

/**
 * فقرة كتلة كود مع تمييز الصيغة
 * @typedef {Object} CodeParagraph
 * @property {ParagraphType & 'code'} type - نوع الفقرة
 * @property {string} text - نص الكود
 * @property {CodingLanguages} [language] - لغة البرمجة
 */

/**
 * فقرة جدول مع صفوف وخلايا
 * @typedef {Object} TableParagraph
 * @property {ParagraphType & 'table'} type - نوع الفقرة
 * @property {ParagraphContent[][]} rows - صفوف الجدول، كل صف هو مصفوفة من الخلايا، كل خلية هي ParagraphContent
 */

/**
 * أنواع تنسيق النص المتاحة
 * @typedef {'bold' | 'italic' | 'strikethrough' | 'highlight' | 'code' | 'subscript' | 'superscript'} TextFormatType
 */

/**
 * تعريف تنسيق النص مع النطاق
 * @typedef {Object} TextFormat
 * @property {TextFormatType} type - نوع تنسيق النص
 * @property {number} start - فهرس البداية للتنسيق في النص
 * @property {number} end - فهرس النهاية للتنسيق في النص
 */

/**
 * محتوى الفقرة مع النص والتنسيق
 * @typedef {Object} ParagraphContent
 * @property {string} text - نص المحتوى
 * @property {TextFormat[]} formats - تنسيقات النص المطبقة على النص
 */

/**
 * تمثيل ملف الماركداون الخام
 * @typedef {Object} MarkdownFile
 * @property {string} path - مسار الملف
 * @property {string} text - محتوى الماركداون الخام
 */

/**
 * ملف الماركداون المحلل مع أقسام منظمة
 * @typedef {Object} ParsedMarkdownFile
 * @property {string} path - مسار الملف
 * @property {Section[]} sections - الأقسام المحللة
 */
