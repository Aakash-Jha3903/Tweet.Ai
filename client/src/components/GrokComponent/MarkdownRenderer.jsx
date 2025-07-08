import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRenderer({ children }) {
  return (
    // <div style={{ whiteSpace: "pre-wrap" }}>
    <>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children: codeChildren, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(codeChildren).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {codeChildren}
              </code>
            );
          },
          p({ children, ...props }) {
            return (
              <p style={{ marginBottom: "0.5rem", whiteSpace: "pre-line" }} {...props}>
                {children}
              </p>
            );
          },
          table({ children }) {
            return (
              <table className="table table-bordered table-striped mb-3">
                {children}
              </table>
            );
          },
          thead({ children }) {
            return <thead className="table-light">{children}</thead>;
          },
          th({ children }) {
            return <th>{children}</th>;
          },
          td({ children }) {
            return <td>{children}</td>;
          },
        }}
      >
        {children}
      </Markdown>
    </>
  );
}
