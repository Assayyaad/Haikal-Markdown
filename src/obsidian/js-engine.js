/** @import { App, Component } from 'obsidian' */
/** @import * as Obsidian from 'obsidian' */

export default {}

/**
 * API for markdown processing and rendering operations.
 * @typedef {Object} MarkdownAPI
 */

/**
 * API for creating and managing messages in the JS Engine plugin.
 * @typedef {Object} MessageAPI
 */

/**
 * API for accessing packaged libraries within the JS Engine plugin.
 * @typedef {Object} LibAPI
 */

/**
 * API for querying vault with JavaScript functions.
 * @typedef {Object} QueryAPI
 */

/**
 * API for user prompts and interactions.
 * @typedef {Object} PromptAPI
 */

/**
 * API for internal plugin operations.
 * @typedef {Object} InternalAPI
 */

/**
 * Reference to the JS Engine plugin's API instance.
 * Provides access to plugin-specific functionality including markdown processing,
 * message system, library imports, vault querying, and internal utilities.
 *
 * @typedef {Object} API
 * @property {MarkdownAPI} markdown - API for markdown processing and rendering
 * @property {MessageAPI} message - API for creating and managing messages
 * @property {LibAPI} lib - API for accessing packaged libraries
 * @property {QueryAPI} query - API for querying vault with JavaScript functions
 * @property {PromptAPI} prompt - API for user prompts and interactions
 * @property {InternalAPI} internal - API for internal plugin operations
 */

/**
 * Obsidian file reference.
 * @typedef {Object} TFile
 */

/**
 * Cached metadata for Obsidian files.
 * @typedef {Object} CachedMetadata
 */

/**
 * Code block position information for markdown blocks.
 * @typedef {Object} Block
 */

/**
 * The execution context providing information about how and where the JavaScript
 * code is being executed. This includes the source type, associated files,
 * metadata, and any additional context properties.
 *
 * @typedef {Object} ExecutionContext
 * @property {'markdown-code-block' | 'markdown-calling-js-file' | 'markdown-other' | 'js-file' | 'unknown'} executionSource
 *   The source type of the execution
 * @property {TFile} [file] - The associated file (if any)
 * @property {CachedMetadata} [metadata] - File metadata (if available)
 * @property {TFile} [jsFile] - The JavaScript file being executed (for file executions)
 * @property {Block} [block] - Code block position information (for markdown blocks)
 */

/**
 * Global variables provided to a JavaScript execution context in the JS Engine plugin.
 * These globals are injected into every JavaScript execution and provide access to
 * Obsidian's API, the plugin's functionality, and execution context.
 * @version 0.3.1
 *
 * @typedef {Object} JsExecutionGlobals
 *
 * @property {App} app - Reference to the Obsidian application instance.
 *   Provides access to the complete Obsidian API including vault operations,
 *   workspace management, metadata cache, and more.
 *   @see {@link https://docs.obsidian.md/Reference/TypeScript+API/App | Obsidian App API}
 *
 * @property {API} engine - Reference to the JS Engine plugin's API instance.
 *   Provides access to plugin-specific functionality including markdown processing,
 *   message system, library imports, vault querying, and internal utilities.
 *
 * @property {Component} component - Obsidian component for lifecycle management.
 *   Used for registering event listeners, intervals, and other cleanup operations
 *   that should be automatically disposed when the execution context is destroyed.
 *   @see {@link https://docs.obsidian.md/Reference/TypeScript+API/Component | Obsidian Component API}
 *
 * @property {ExecutionContext & Record<string, unknown>} context - The execution context providing
 *   information about how and where the JavaScript code is being executed. This includes the source
 *   type, associated files, metadata, and any additional context properties.
 *
 * @property {HTMLElement | undefined} container - The HTML container element that the execution
 *   can render content to. This is typically provided when the JavaScript is executed in a context
 *   where visual output is expected (e.g., markdown code blocks).
 *
 * @property {Obsidian} obsidian - The complete Obsidian module export, providing
 *   access to all Obsidian classes, functions, and utilities. This allows construction of Obsidian
 *   objects like Notice, Modal, Setting, etc.
 *
 * @example
 * ```js
 * // Access Obsidian app
 * const files = app.vault.getFiles();
 *
 * // Use plugin API
 * const notice = engine.message.createMessage('info', 'Hello', 'World');
 *
 * // Access execution context
 * if (context.executionSource === 'markdown-code-block') {
 *   console.log('Executed from markdown:', context.file?.name);
 * }
 *
 * // Render to container
 * if (container) {
 *   container.innerHTML = '<p>Hello World</p>';
 * }
 *
 * // Use Obsidian module
 * new obsidian.Notice('Hello from JS Engine!');
 * ```
 *
 * @example
 * // Get all files in vault
 * const files = app.vault.getFiles();
 *
 * // Access workspace
 * const activeFile = app.workspace.getActiveFile();
 *
 * // Get metadata cache
 * const cache = app.metadataCache.getFileCache(activeFile);
 *
 * @example
 * // Import a JavaScript module
 * const module = await engine.importJs('scripts/utils.js');
 *
 * // Create a message
 * const msg = engine.message.createMessage('info', 'Title', 'Content');
 *
 * // Query vault files
 * const notes = engine.query.file.where(f => f.extension === 'md');
 *
 * // Get a plugin reference
 * const templater = engine.getPlugin('templater-obsidian');
 *
 * @example
 * // Register an event listener that will be auto-cleaned
 * component.registerEvent(
 *   app.workspace.on('file-open', (file) => {
 *     console.log('File opened:', file?.name);
 *   })
 * );
 *
 * // Register an interval that will be auto-cleaned
 * component.registerInterval(
 *   window.setInterval(() => console.log('tick'), 1000)
 * );
 *
 * @example
 * // Check execution source
 * switch (context.executionSource) {
 *   case 'markdown-code-block':
 *     console.log('Executed from markdown code block in:', context.file?.name);
 *     break;
 *   case 'js-file':
 *     console.log('Executed from JS file:', context.jsFile?.name);
 *     break;
 *   case 'markdown-calling-js-file':
 *     console.log('JS file called from markdown:', context.file?.name);
 *     break;
 * }
 *
 * // Access custom context properties
 * if (context.customProperty) {
 *   console.log('Custom context:', context.customProperty);
 * }
 *
 * @example
 * if (container) {
 *   // Create and append elements
 *   const div = document.createElement('div');
 *   div.textContent = 'Hello from JS Engine!';
 *   div.className = 'my-custom-class';
 *   container.appendChild(div);
 *
 *   // Or set innerHTML directly
 *   container.innerHTML = `
 *     <h3>Dynamic Content</h3>
 *     <p>Generated at ${new Date().toLocaleString()}</p>
 *   `;
 * } else {
 *   console.log('No container available for rendering');
 * }
 *
 * @example
 * // Show a notice
 * new obsidian.Notice('Hello World!');
 *
 * // Create a modal
 * class MyModal extends obsidian.Modal {
 *   onOpen() {
 *     this.contentEl.setText('Hello from modal!');
 *   }
 * }
 * new MyModal(app).open();
 *
 * // Use utility functions
 * const sanitized = obsidian.sanitizeHTMLToDom('<p>Safe HTML</p>');
 *
 * // Access constants
 * if (obsidian.Platform.isMobile) {
 *   console.log('Running on mobile');
 * }
 * ```
 */
