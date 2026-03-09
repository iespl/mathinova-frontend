import katex from 'katex';
import 'katex/dist/katex.min.css';

// Configure KaTeX globally for Quill formula module
if (typeof window !== 'undefined') {
  (window as any).katex = katex;
}

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

import React, { useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Fix Quill 2.0 formula blot stripping its own attributes during HTML generation
const Embed: any = Quill.import('blots/embed');
// @ts-ignore
class CustomFormulaBlot extends Embed {
  static create(value: string) {
    const node = super.create(value);
    if (typeof value === 'string') {
      // Force the class and data-value so they persist in HTML exports
      node.setAttribute('class', 'ql-formula');
      node.setAttribute('data-value', value);
      // Render KaTeX visually in the editor
      if (typeof window !== 'undefined' && (window as any).katex) {
        try {
          (window as any).katex.render(value, node, {
            throwOnError: false,
            errorColor: '#f00'
          });
        } catch (e) {
          node.innerText = value;
        }
      } else {
        node.innerText = value;
      }
    }
    return node;
  }

  static value(domNode: HTMLElement) {
    return domNode.getAttribute('data-value');
  }

  html() {
    // @ts-ignore
    const value = this.domNode.getAttribute('data-value');
    // @ts-ignore
    return `<span class="ql-formula" data-value="${value}">${this.domNode.innerHTML}</span>`;
  }
}
// @ts-ignore
CustomFormulaBlot.blotName = 'formula';
// @ts-ignore
CustomFormulaBlot.tagName = 'span';
// @ts-ignore
CustomFormulaBlot.className = 'ql-formula';

// @ts-ignore
Quill.register(CustomFormulaBlot, true);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  // Memoize modules to prevent re-renders causing Quill crashes
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['link', 'image', 'formula'],
        ['clean'],
        ['undo', 'redo']
      ],
      handlers: {
        undo: function () {
          // @ts-ignore
          this.quill.history.undo();
        },
        redo: function () {
          // @ts-ignore
          this.quill.history.redo();
        }
      }
    },
    history: {
      delay: 500,
      maxStack: 500,
      userOnly: true
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'script',
    'link', 'image', 'formula'
  ];

  return (
    <div className="rich-text-editor bg-white rounded-lg overflow-hidden border border-gray-200">
      <style>{`
        .rich-text-editor .ql-toolbar {
          background: rgba(0, 0, 0, 0.04);
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        }
        .rich-text-editor .ql-container {
          border: none;
          min-height: 150px;
          color: #111827;
        }
        .rich-text-editor .ql-editor {
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: rgba(0, 0, 0, 0.75);
        }
        .rich-text-editor .ql-snow .ql-fill {
          fill: rgba(0, 0, 0, 0.75);
        }
        .rich-text-editor .ql-snow .ql-picker {
          color: rgba(0, 0, 0, 0.75);
        }
        .rich-text-editor .ql-snow .ql-picker-options {
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
