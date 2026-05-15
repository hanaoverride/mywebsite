'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextViewer() {
  const t = useTranslations('apps.textviewer');

  const defaultContent = t.raw('defaultContent') as string;

  // Pre-process lines to determine code block state for each line
  const processedLines = useMemo(() => {
    return defaultContent.split('\n').reduce<{
      items: Array<{ isCodeDelimiter: boolean; content: string; isInCodeBlock: boolean; lineNumber: number }>;
      inBlock: boolean;
      counter: number;
    }>((acc, line) => {
      const isDelim = line.trim().startsWith('```');
      const nextInBlock = isDelim ? !acc.inBlock : acc.inBlock;
      
      return {
        items: [
          ...acc.items,
          {
            isCodeDelimiter: isDelim,
            content: line,
            isInCodeBlock: nextInBlock,
            lineNumber: isDelim ? -1 : acc.counter
          }
        ],
        inBlock: nextInBlock,
        counter: isDelim ? acc.counter : acc.counter + 1
      };
    }, { items: [], inBlock: false, counter: 1 }).items;
  }, [defaultContent]);

  return (
    <div className="h-full overflow-auto bg-[#272822] custom-scrollbar" data-testid="text-viewer">
      <div className="min-w-full inline-block pt-3 pb-8">
        {processedLines.map((item, i) => {
          if (item.isCodeDelimiter) return null;

          return (
            <div key={i} className="flex group hover:bg-white/5">
              <div className="w-12 flex-shrink-0 bg-[#1e1f1c]/50 text-[#75715E] text-xs font-mono text-right px-2 py-1 select-none border-r border-gray-700/30 sticky left-0 z-10">
                {item.lineNumber}
              </div>
              <div 
                className={`flex-1 text-[#F8F8F2] text-sm font-mono px-3 py-0.5 whitespace-pre-wrap break-words overflow-hidden ${item.isInCodeBlock ? 'bg-black/20' : ''}`}
                style={{ lineHeight: '1.5rem' }}
              >
                {item.isInCodeBlock ? (
                  <CodeLine content={item.content} />
                ) : (
                  <MarkdownLine content={item.content} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarkdownLine({ content }: { content: string }) {
  if (content.startsWith('# ')) {
    return <span className="text-yellow-300 font-bold text-lg">{content}</span>;
  }
  if (content.startsWith('## ')) {
    return <span className="text-orange-300 font-bold text-base">{content}</span>;
  }
  if (content.startsWith('- ')) {
    const listContent = content.substring(2);
    const parts = listContent.split('**');
    return (
      <span>
        <span className="text-pink-500">- </span>
        {parts.map((part, i) => (
          <span key={i} className={i % 2 === 1 ? "font-bold text-blue-300" : ""}>
            {part.split('`').map((subPart, j) => (
              <span key={j} className={j % 2 === 1 ? "bg-white/10 px-1 rounded text-green-300" : ""}>
                {subPart}
              </span>
            ))}
          </span>
        ))}
      </span>
    );
  }
  
  // Handle inline code and bold for regular lines
  const parts = content.split('**');
  return (
    <span>
      {parts.map((part, i) => (
        <span key={i} className={i % 2 === 1 ? "font-bold text-blue-300" : ""}>
          {part.split('`').map((subPart, j) => (
            <span key={j} className={j % 2 === 1 ? "bg-white/10 px-1 rounded text-green-300" : ""}>
              {subPart}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function CodeLine({ content }: { content: string }) {
  // Very basic syntax highlighting
  const keywords = ['export', 'default', 'function', 'return', 'import', 'from', 'const', 'let', 'type'];
  const types = ['ReactNode', 'string', 'number', 'boolean'];
  
  const tokens = content.split(/(\s+|[{}()<>\[\].,;:"'])/);
  
  return (
    <span>
      {tokens.map((token, i) => {
        if (keywords.includes(token.trim())) {
          return <span key={i} className="text-pink-500">{token}</span>;
        }
        if (types.includes(token.trim())) {
          return <span key={i} className="text-blue-300 italic">{token}</span>;
        }
        if (token.startsWith('//')) {
          return <span key={i} className="text-gray-500 italic">{token}</span>;
        }
        if (token.startsWith('"') || token.startsWith("'")) {
          return <span key={i} className="text-yellow-200">{token}</span>;
        }
        if (token.match(/^[A-Z][a-zA-Z0-9]+$/)) { // Component names
          return <span key={i} className="text-green-300">{token}</span>;
        }
        return <span key={i}>{token}</span>;
      })}
    </span>
  );
}
