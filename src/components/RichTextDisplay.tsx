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
    // Generate a unique ID for this instance to scope the styles
    const instanceId = useMemo(() => `rt-${Math.random().toString(36).substr(2, 9)}`, []);

    const processedHtml = useMemo(() => {
        if (!htmlContent) return '';

        let content = htmlContent;

        // 1. Sanitize non-breaking spaces
        content = content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

        // 2. Convert standard math delimiters
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
        content = content.replace(/<span[^>]*class=["'][^"']*ql-formula[^"']*["'][^>]*data-value=["']([^"']+)["'][^>]*>[\s\S]*?<\/span>(\s*<\/span>)*/g, (match, formula) => {
            try {
                let decodedFormula = formula.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
                return katex.renderToString(decodedFormula, { throwOnError: false, displayMode: false });
            } catch (e) {
                return match;
            }
        });

        // 4. Convert raw inline math
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
        <div 
            id={instanceId} 
            className={`rich-text-content ${className}`} 
            style={{ 
                ...style, 
                boxSizing: 'border-box',
                maxWidth: '100%',
                overflowX: 'visible', // Allow images to spill out into parent padding
                wordBreak: 'break-word'
            }}
        >
            <style>{`
                #${instanceId} * {
                    box-sizing: border-box !important;
                }
                #${instanceId} p,
                #${instanceId} div,
                #${instanceId} h1,
                #${instanceId} h2,
                #${instanceId} h3,
                #${instanceId} h4,
                #${instanceId} h5,
                #${instanceId} h6,
                #${instanceId} ul,
                #${instanceId} ol {
                    max-width: 100% !important;
                    margin: 0 0 0.5em 0 !important;
                    box-sizing: border-box !important;
                    padding-left: ${fullWidthImages ? 'var(--rt-padding, 0)' : '0'} !important;
                    padding-right: ${fullWidthImages ? 'var(--rt-padding, 0)' : '0'} !important;
                }
                #${instanceId} img {
                    display: block !important;
                    margin: 12px ${fullWidthImages ? 'calc(-1 * var(--rt-padding, 20px))' : '0'} !important;
                    border-radius: ${fullWidthImages ? '0' : '8px'};
                    height: auto !important;
                    width: ${fullWidthImages ? 'calc(100% + 2 * var(--rt-padding, 20px))' : '100%'} !important;
                    max-width: ${fullWidthImages ? 'none' : '100%'} !important;
                    object-fit: contain !important;
                }
                #${instanceId} {
                    --rt-padding: ${horizontalPadding !== undefined ? horizontalPadding+'px' : '20px'};
                }
                @media (min-width: 768px) {
                    #${instanceId} {
                        --rt-padding: ${horizontalPadding !== undefined ? horizontalPadding+'px' : '40px'};
                    }
                }
                #${instanceId} .katex-display {
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    max-width: 100% !important;
                    padding: 0.8rem 0;
                    margin: 0 !important;
                    text-align: left !important; /* Align equations to the left */
                }
                #${instanceId} .katex-display > .katex {
                    text-align: left !important;
                    white-space: normal !important;
                }
                #${instanceId} .katex-mathml {
                    display: none !important;
                }
                #${instanceId} strong { font-weight: 700; }
                #${instanceId} em { font-style: italic; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: processedHtml }} style={{ maxWidth: '100%', boxSizing: 'border-box' }} />
        </div>
    );
};

export default RichTextDisplay;
