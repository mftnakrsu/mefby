import React, { useEffect, useRef } from 'react';
import { WritingPost } from '../types';
import Markdown from './Markdown';

interface BlogPostModalProps {
  post: WritingPost | null;
  onClose: () => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!post) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeBtnRef.current?.focus();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-zinc-900/30 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-10 animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-post-title"
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div
        ref={scrollRef}
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] overflow-y-auto animate-[slideUp_0.25s_ease-out] border border-zinc-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-zinc-100 px-6 sm:px-10 py-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-600 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Essay
          </span>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded-md hover:bg-zinc-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <article className="px-6 sm:px-10 pt-8 pb-16">
          <p className="text-xs font-mono text-zinc-400 mb-3 tracking-wider">{post.date}</p>
          <h1
            id="blog-post-title"
            className="text-2xl sm:text-[28px] font-semibold text-zinc-900 leading-[1.25] tracking-tight mb-6"
          >
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-[15px] text-zinc-600 italic leading-relaxed border-l-2 border-emerald-400 pl-4 mb-10">
              {post.summary}
            </p>
          )}

          {post.content && <Markdown content={post.content} />}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogPostModal;
