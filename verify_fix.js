const katex = require('katex');

function process(htmlContent) {
    let content = htmlContent;
    content = content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

    const katexOptions = { 
        throwOnError: false, 
        displayMode: false,
        output: 'html' 
    };

    // Simulate the regex logic from RichTextDisplay.tsx
    content = content.replace(/<span[^>]*class=["'][^"']*ql-formula[^"']*["'][^>]*data-value=["']([^"']+)["'][^>]*>([\s\S]*?)<\/span>(\s*<\/span>)*/g, (match, formula) => {
        try {
            let decodedFormula = formula.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            return katex.renderToString(decodedFormula, katexOptions);
        } catch (e) {
            return match;
        }
    });

    return content;
}

const testInput = 'Find the Laplace Transform of <span class="ql-formula" data-value="e^{-3t}(2 \\cos 5t - 3 \\sin 5t)"></span>';
const output = process(testInput);

console.log("Output contains katex-mathml:", output.includes('katex-mathml'));
console.log("Output contains annotation:", output.includes('annotation'));
console.log("Output contains katex-html:", output.includes('katex-html'));

if (!output.includes('katex-mathml') && output.includes('katex-html')) {
    console.log("SUCCESS: MathML is gone, HTML is present.");
} else {
    console.log("FAILURE: Output does not match expected state.");
}
