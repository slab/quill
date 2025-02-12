const fs = require('fs');
const { dirname, resolve } = require('path');
const { optimize } = require('svgo');

module.exports = ({ types: t }) => {
  class BabelSVGInlineImport {
    constructor() {
      return {
        visitor: {
          ImportDeclaration: {
            exit(path, state) {
              const givenPath = path.node.source.value;
              if (!givenPath.endsWith('.svg')) {
                return;
              }
              const specifier = path.node.specifiers[0];
              const id = specifier.local.name;
              const reference = state && state.file && state.file.opts.filename;
              const absolutePath = resolve(dirname(reference), givenPath);
              const content = fs.readFileSync(absolutePath).toString();
              let optimizedContent;
              try {
                optimizedContent = optimize(content, { plugins: [] }).data;
              } catch (error) {
                console.error(`Error optimizing SVG: ${absolutePath}`, error);
                return;
              }

              const variableValue = t.stringLiteral(content);
              const variable = t.variableDeclarator(
                t.identifier(id),
                variableValue,
              );

              path.replaceWith({
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [variable],
              });
            },
          },
        },
      };
    }
  }

  return new BabelSVGInlineImport();
};
