import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { defaultSchema } from 'rehype-sanitize';
import merge from 'deepmerge';
import { visit } from 'unist-util-visit';

const syntaxHighlightingSchema = merge(defaultSchema, {
  attributes: {
    code: [...(defaultSchema.attributes.code || []), 'class'],
  },
});

const MarkdownRenderer = ({ markdown, style }) => {
  function rehypeOnLoadPlugin() {
    return (tree) => {
      visit(tree, 'element', (node) => {
        if (node.tagName === 'img' || node.tagName === 'video') {
          node.properties.loading = "lazy";
        }
      });
    };
  }

  return (
      <div className="markdown-body" style={style}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeOnLoadPlugin, { settings: syntaxHighlightingSchema }]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (!inline) {
                  return (
                      <div className={className} style={{backgroundColor: "#1c1c1a"}} {...props}>
                        {children}
                      </div>
                  );
                }
                // Inline code rendering
                return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                );
              },
            }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
  );
};

MarkdownRenderer.defaultProps = {
  style: {
    overflowWrap: 'break-word',
    borderRadius: '10px',
    padding: '2em 3em',
    width: '85%',
    backgroundColor: '#f5f5f5', // example static background color
  },
};

export default MarkdownRenderer;
