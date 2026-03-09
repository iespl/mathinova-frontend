import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface RichTextDisplayProps {
    htmlContent: string;
    className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ htmlContent, className = '' }) => {
    const processedHtml = useMemo(() => {
        if (!htmlContent) return '';

        let content = htmlContent;

        // 1. Sanitize non-breaking spaces that cause clipping/wrapping issues
        content = content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

        // 2. Convert standard math delimiters
        // Display math $$...$$ or \[...\]
        content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            try {
                return katex.renderToString(formula, { throwOnError: false, displayMode: true });
            } catch (e) {
                return match;
            }
        });

        content = content.replace(/\\\[([\s\S]+?)\\\]/g, (match, formula) => {
            try {
                return katex.renderToString(formula, { throwOnError: false, displayMode: true });
            } catch (e) {
                return match;
            }
        });

        // 3. Convert Quill formula spans
        // These often contain pre-rendered KaTeX with nested spans (e.g. <span><span>...</span></span>).
        // We match the opening ql-formula tag and then consume all content including nested closing spans.
        content = content.replace(/<span[^>]*class=["'][^"']*ql-formula[^"']*["'][^>]*data-value=["']([^"']+)["'][^>]*>[\s\S]*?<\/span>(\s*<\/span>)*/g, (match, formula) => {
            try {
                let decodedFormula = formula.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
                return katex.renderToString(decodedFormula, { throwOnError: false, displayMode: false });
            } catch (e) {
                return match;
            }
        });

        // 4. Convert raw inline math $...$ or \(...\)
        content = content.replace(/\$((?:[^$]|\\\$)+?)\$/g, (match, formula) => {
            try {
                return katex.renderToString(formula, { throwOnError: false, displayMode: false });
            } catch (e) {
                return match;
            }
        });

        content = content.replace(/\\\(([\s\S]+?)\\\)/g, (match, formula) => {
            try {
                return katex.renderToString(formula, { throwOnError: false, displayMode: false });
            } catch (e) {
                return match;
            }
        });

        return content;
    }, [htmlContent]);

    return (
        <div className={`rich-text-content prose prose-sm dark:prose-invert ${className}`}>
            <style>{`
                .rich-text-content {
                    /* Explicitly override Tailwind's prose word-breaking */
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                }
                .rich-text-content h1, 
                .rich-text-content h2, 
                .rich-text-content h3, 
                .rich-text-content h4, 
                .rich-text-content h5, 
                .rich-text-content p,
                .rich-text-content li {
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                    hyphens: none !important;
                }
                .rich-text-content p,
                .rich-text-content div {
                    max-width: 100%;
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                }
                .rich-text-content p:empty, 
                .rich-text-content p > br:only-child {
                    display: none !important;
                }
                /* Definitively hide KaTeX duplicates/fallbacks */
                .katex-mathml,
                .katex-html + .katex-html,
                .katex + .katex-html,
                .katex ~ .katex-html {
                    display: none !important;
                }
                /* Ensure math equations don't stretch the screen on mobile, but scroll horizontally */
                .katex-display {
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    max-width: 100% !important;
                    padding-bottom: 0.5rem;
                }
                .katex {
                    white-space: normal !important;
                }
                .rich-text-content img {
                    max-width: 100% !important;
                    width: 100% !important; /* Ensure images take full width of container */
                    height: auto !important;
                    border-radius: 0 !important; /* Remove rounding for seamless slices */
                    margin: 0 auto !important; /* Zero margin to remove all gaps */
                    display: block !important;
                }
                .katex-display {
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 0.5rem;
                    padding-top: 0.5rem;
                }
                /* Optional for inline katex to prevent overflow */
                .katex {
                    white-space: normal;
                }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
        </div>
    );
};

export default RichTextDisplay;

