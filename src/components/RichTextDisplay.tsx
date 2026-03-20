import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface RichTextDisplayProps {
    htmlContent: string;
    className?: string;
    style?: React.CSSProperties;
    fullWidthImages?: boolean;
    horizontalPadding?: number;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ 
    htmlContent, 
    className = '', 
    style,
    fullWidthImages = false,
    horizontalPadding
}) => {
    const instanceId = useMemo(() => `rt-${Math.random().toString(36).substr(2, 9)}`, []);

    const processedHtml = useMemo(() => {
        if (!htmlContent) return '';
        
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            const formulaSpans = doc.querySelectorAll('.ql-formula');
            formulaSpans.forEach(span => {
                const formula = span.getAttribute('data-value');
                if (formula) {
                    try {
                        let decodedFormula = formula.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
                        const rendered = katex.renderToString(decodedFormula, {
                            throwOnError: false,
                            displayMode: false,
                            output: 'html'
                        });
                        span.innerHTML = rendered;
                        span.classList.add('rt-rendered');
                    } catch (e) {}
                }
            });

            const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, (node) => {
                let parent = node.parentElement;
                while (parent) {
                    if (parent.classList.contains('katex') || parent.classList.contains('rt-rendered')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    parent = parent.parentElement;
                }
                return NodeFilter.FILTER_ACCEPT;
            });

            let n;
            const textNodes = [];
            while (n = walk.nextNode()) { textNodes.push(n); }

            textNodes.forEach(node => {
                let text = node.nodeValue || '';
                if (!text.trim() || text.length < 2) return;

                let hasMath = false;
                text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
                    hasMath = true;
                    try { return katex.renderToString(formula, { throwOnError: false, displayMode: true, output: 'html' }); } catch (e) { return match; }
                });
                text = text.replace(/\\\[([\s\S]+?)\\\]/g, (match, formula) => {
                    hasMath = true;
                    try { return katex.renderToString(formula, { throwOnError: false, displayMode: true, output: 'html' }); } catch (e) { return match; }
                });
                text = text.replace(/\$((?:[^$]|\\\$)+?)\$/g, (match, formula) => {
                    hasMath = true;
                    try { return katex.renderToString(formula, { throwOnError: false, displayMode: false, output: 'html' }); } catch (e) { return match; }
                });
                text = text.replace(/\\\(([\s\S]+?)\\\)/g, (match, formula) => {
                    hasMath = true;
                    try { return katex.renderToString(formula, { throwOnError: false, displayMode: false, output: 'html' }); } catch (e) { return match; }
                });

                if (hasMath) {
                    const span = doc.createElement('span');
                    span.innerHTML = text;
                    node.parentNode?.replaceChild(span, node);
                }
            });

            return doc.body.innerHTML;
        } catch (err) {
            return htmlContent;
        }
    }, [htmlContent]);

    return (
        <div id={instanceId} className={`rich-text-content-v5 ${className}`} style={{ ...style, boxSizing: 'border-box', maxWidth: '100%', overflowX: 'visible', wordBreak: 'break-word' }}>
            <style>{`
                #${instanceId} * { box-sizing: border-box !important; }
                #${instanceId} .katex-mathml, 
                #${instanceId} .katex-accessible,
                #${instanceId} .katex > .katex-html + .katex-html,
                #${instanceId} .katex-html > .katex-mathml { 
                    display: none !important; 
                    visibility: hidden !important; 
                    opacity: 0 !important; 
                    height: 0 !important; 
                    width: 0 !important; 
                    position: absolute !important; 
                    pointer-events: none !important;
                }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
        </div>
    );
};

export default RichTextDisplay;
