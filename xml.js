const { DOMParser } = require('xmldom');

const TAB = '    ';
const MAX_NODE_LENGTH = 64;

function parse (xml) {
    return new DOMParser().parseFromString(xml);
}

function shouldUnindent (line) {
    return line.match(/^<\/.*>$/);
}

function shouldNotIndent (line) {
    return line.match(/^<\?.*\?>$/) ||
        line.match(/^<.*\/>$/) ||
        line.match(/^<.*?>.*?<\/.*?>$/);
}

function shouldIndent (line) {
    return line.match(/^<.*>$/) && !shouldNotIndent(line);
}

function indent (line) {
    return {
        by: function (tabs) {
            return `${TAB.repeat(tabs >= 0 ? tabs : 0)}${line}`;
        },
    };
}

function prettifyNode (line) {
    const isNode = line.match(/(\s*)(<\/?.*?\/?>)/);
    if (!isNode)
        return line;

    const [ , leadingWhiteSpace, node ] = isNode;

    if (node.length <= MAX_NODE_LENGTH)
        return line;

    const endChars = node.substring(node.length - 2) === '/>' ? '/>' : '>';
    const end = `${leadingWhiteSpace}${endChars}`;

    const nodeParts = node.substring(1, node.length - endChars.length).split(' ');
    const start = `${leadingWhiteSpace}<${nodeParts.shift()}`;

    const attributes = nodeParts.map(attr => `${leadingWhiteSpace}${TAB}${attr}`);
    line = [ start, ...attributes, end ].join('\n');

    return line;
}

function prettify (xml) {
    const lines = xml
        // replace <name /> with <name/>
        .replace(/(<\/?.*?)\s+(\/?>)/g, '$1$2')
        // replace <name/><name/> with <name/>\n<name/>
        .replace(/(<\/?.*?\/?>)(<\/?.*?\/?>)/g, '$1\n$2')
        // replace <name/>text with <name/>\ntext
        .replace(/(<\/?.*?\/?>)([^\n])/g, '$1\n$2')
        // replace text<name/> with text\n<name/>
        .replace(/([^\n])(<\/?.*?\/?>)/g, '$1\n$2')
        .split('\n');
        // .map(line => line.trim());
    let tabs = 0;
    const indentedLines = lines.map(line => {
        if (shouldUnindent(line)) {
            tabs--;
            line = indent(line).by(tabs);
        } else if (shouldIndent(line)) {
            line = indent(line).by(tabs);
            tabs++;
        } else {
            line = indent(line).by(tabs);
        }

        line = prettifyNode(line);

        return line;
    });
    return indentedLines.join('\n');
}

module.exports = {
    indent,
    prettify,
    parse,
};