import React from 'react';

interface MarkdownProps {
  content: string;
}

type InlinePattern = {
  regex: RegExp;
  render: (match: string, key: number) => React.ReactNode;
};

const INLINE_PATTERNS: InlinePattern[] = [
  {
    regex: /`([^`]+)`/,
    render: (m, key) => (
      <code key={key} className="bg-zinc-100 text-emerald-700 px-1.5 py-0.5 rounded text-[0.9em] font-mono">
        {m}
      </code>
    ),
  },
  {
    regex: /\*\*([^*]+)\*\*/,
    render: (m, key) => (
      <strong key={key} className="font-semibold text-zinc-900">
        {m}
      </strong>
    ),
  },
  {
    regex: /\*([^*\n]+)\*/,
    render: (m, key) => (
      <em key={key} className="italic">
        {m}
      </em>
    ),
  },
];

const renderInline = (text: string, baseKey: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let remaining = text;
  let counter = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; length: number; node: React.ReactNode } | null = null;

    for (const { regex, render } of INLINE_PATTERNS) {
      const match = remaining.match(regex);
      if (match && match.index !== undefined) {
        if (earliest === null || match.index < earliest.index) {
          earliest = {
            index: match.index,
            length: match[0].length,
            node: render(match[1], counter++),
          };
        }
      }
    }

    if (!earliest) {
      out.push(<React.Fragment key={`${baseKey}-t-${counter++}`}>{remaining}</React.Fragment>);
      break;
    }

    if (earliest.index > 0) {
      out.push(
        <React.Fragment key={`${baseKey}-t-${counter++}`}>
          {remaining.slice(0, earliest.index)}
        </React.Fragment>,
      );
    }
    out.push(earliest.node);
    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return out;
};

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let blockKey = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ').trim();
    if (text) {
      blocks.push(
        <p key={`p-${blockKey++}`} className="text-[15px] text-zinc-600 leading-[1.75] mb-5">
          {renderInline(text, `p-${blockKey}`)}
        </p>,
      );
    }
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    const items = listItems;
    blocks.push(
      <ul key={`ul-${blockKey++}`} className="mb-6 space-y-2.5 pl-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-[15px] text-zinc-600 leading-[1.7] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-2 before:h-px before:bg-emerald-400"
          >
            {renderInline(item, `li-${blockKey}-${i}`)}
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2
          key={`h2-${blockKey++}`}
          className="text-lg font-semibold text-zinc-900 mt-12 mb-4 tracking-tight"
        >
          {renderInline(line.slice(3), `h2-${blockKey}`)}
        </h2>,
      );
    } else if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3
          key={`h3-${blockKey++}`}
          className="text-base font-semibold text-zinc-900 mt-8 mb-3"
        >
          {renderInline(line.slice(4), `h3-${blockKey}`)}
        </h3>,
      );
    } else if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2));
    } else if (line === '') {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <div>{blocks}</div>;
};

export default Markdown;
