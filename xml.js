const TAB = '    ';
const MAX_NODE_LENGTH = 64;

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

    const start = `${leadingWhiteSpace}<${node.substring(1, node.indexOf(' '))}`;
    const endChars = node.substring(node.length - 2) === '/>' ? '/>' : '>';
    const end = `${leadingWhiteSpace}${endChars}`;

    const attributes = node
        .substring(1, node.length - endChars.length)
        .match(/(\S+=".*?")/g)
        .map(attr => `${leadingWhiteSpace}${TAB}${attr}`);
    line = [ start, ...attributes, end ].join('\n');

    return line;
}

function prettify (xml) {
    const lines = xml
        // replace <name /> with <name/>
        .replace(/(<\/?.*?)\s+(\/?>)/g, '$1$2')
        // split <name/><name/> onto multiple lines
        .replace(/(<\/?.*?\/?>)(<\/?.*?\/?>)/g, '$1\n$2')
        .replace(/(<\/?.*?\/?>)(<\/?.*?\/?>)/g, '$1\n$2')
        // split <name/>text<name/>|<name>|</name> onto multiple lines
        .replace(/(<[^/].*?\/>)([^\n][^<>]+?)(<\/?.*?\/?>)/g, '$1\n$2\n$3')
        // split <name>text<name/>|<name> onto multiple lines
        .replace(/(<[^/].*?[^/]>)([^\n][^<>]+?)(<[^/].*?\/?>)/g, '$1\n$2\n$3')
        // split </name>text<name/>|<name>|</name> onto multiple lines
        .replace(/(<\/.*?>)([^\n][^<>]+?)(<\/?.*?\/?>)/g, '$1\n$2\n$3')
        .split('\n');
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
};