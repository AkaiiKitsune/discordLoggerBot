exports.parsemd = function (mdtext) {
    /**
     * Reads a string formatted with Markdown as input argument 
     * `mdtext`, and returns the same text but reformatted with HTML instead.
     */

    // Giving some names to the Markdown controls.
    const textm = '***'; // Toggle Emphasis (Bold + Italics)
    const textb = '**';  // Toggle Bold
    const texti = '*';   // Toggle Italics
    const textu = '__';  // Toggle Underline
    const textc = '`';   // Toggle Code (Inline)
    const textq = '> ';  // Start Quote
    const textC = '```'; // Toggle Code (Block)

    let htmltext = '';
    let temptext = '' + mdtext;

    function tagify(text, symbol, opentag, closetag) {
        /**
         * Reads a line of string as `text`, which contains an even
         * number of instances of the Unicode character `symbol`.
         * Replaces all occurances of the symbol by HTML tag sets denoted by 
         * the tags `opentag` for odd positions and `closetag` for even positions.
         */
        let temp = '';
        let segments = text.split(symbol);        
        for(let i = 0; i < segments.length; i++) {
            if(i % 2 == 1)
                temp += opentag;
            if(i % 2 == 0 && i != 0)
                temp += closetag;
            temp += segments[i];
        }
        if(segments.length % 2 == 0) {
            temp = temp + closetag;
        }
        return temp;
    }

    // Implementing all controls except quote and blockquote
    temptext = tagify(temptext, textm, '<b><i>', '</b></i>');
    temptext = tagify(temptext, textb, '<b>', '</b>');
    temptext = tagify(temptext, texti, '<i>', '</i>');
    temptext = tagify(temptext, textu, '<u>', '</u>');
    temptext = tagify(temptext, textC, '\n<pre bgcolor="#d0d0d0">\n', '\n</pre>\n');
    temptext = tagify(temptext, textc, '<font face="mono" color="#505050">', '</font>');
    

    // Checking for blockquote
    if(mdtext.substring(0,3) == ">>>") {        
        htmltext = temptext.substring(3,temptext.length);
        return htmltext;
    }
    // Implementing normal quotes
    else {
        blocksegments = temptext.split('\n');
        for(let i = 0; i < blocksegments.length; i++) {
            if(blocksegments[i].substring(0,2) == textq)
                blocksegments[i] = `<blockquote>\n${blocksegments[i].substring(1,blocksegments[i].length)}\n</blockquote>`;
        }
        htmltext = blocksegments.join('<br/>');
    }

    return htmltext;
}