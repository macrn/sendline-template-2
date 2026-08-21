import React, { useState } from 'react';
import { ExternalLink, Maximize2, X } from 'lucide-react';

interface EmailContentRendererProps {
  content: string;
  className?: string;
}

export const EmailContentRenderer: React.FC<EmailContentRendererProps> = ({ content, className = '' }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!content) {
    return <div className="text-stone-400 italic">No message content</div>;
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  // Helper to linkify plain text
  const renderPlainTextWithLinks = (text: string) => {
    // Regex for URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <div className="whitespace-pre-line text-stone-900 leading-relaxed font-sans font-medium text-sm sm:text-base break-words">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            // Check if it's an image url
            const isImageUrl = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(part);
            if (isImageUrl) {
              return (
                <div key={index} className="my-4 inline-block group relative">
                  <img
                    src={part}
                    alt="Email attachment"
                    className="max-h-96 max-w-full rounded-2xl shadow-md border-2 border-stone-200 object-cover cursor-zoom-in transition-transform hover:scale-[1.01]"
                    onClick={() => setLightboxImage(part)}
                    loading="lazy"
                  />
                  <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1 font-medium">
                    <span>Click image to expand</span>
                  </div>
                </div>
              );
            }
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ea583a] hover:underline font-semibold break-all inline-flex items-center gap-0.5 mx-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{part}</span>
                <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className={`email-content-wrapper ${className}`}>
      {isHtml ? (
        <div
          className="email-html-body prose prose-stone max-w-none text-stone-900 leading-relaxed break-words font-sans
            [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-stone-950 [&_h1]:mt-4 [&_h1]:mb-2
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-stone-950 [&_h2]:mt-3 [&_h2]:mb-2
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-stone-900 [&_h3]:mt-3 [&_h3]:mb-1
            [&_p]:my-2.5 [&_p]:text-stone-900 [&_p]:font-medium [&_p]:leading-relaxed
            [&_a]:text-[#ea583a] [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-[#d84b2e]
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1
            [&_li]:text-stone-800 [&_li]:font-medium
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#ea583a] [&_blockquote]:bg-stone-50/80 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-3 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-stone-700
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-4 [&_img]:border [&_img]:border-stone-200
            [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:border [&_table]:border-stone-200 [&_table]:rounded-xl [&_table]:overflow-hidden
            [&_th]:bg-stone-100 [&_th]:p-2.5 [&_th]:text-left [&_th]:font-bold [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:border-b [&_th]:border-stone-200
            [&_td]:p-2.5 [&_td]:border-b [&_td]:border-stone-100 [&_td]:text-xs sm:[&_td]:text-sm
            [&_code]:bg-stone-100 [&_code]:text-[#ea583a] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs [&_code]:font-bold
            [&_pre]:bg-stone-900 [&_pre]:text-stone-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:font-mono [&_pre]:text-xs"
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target && target.tagName === 'IMG') {
              const src = (target as HTMLImageElement).src;
              if (src) {
                setLightboxImage(src);
              }
            }
          }}
        />
      ) : (
        renderPlainTextWithLinks(content)
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#1a1918] rounded-3xl p-3 border-2 border-stone-700 shadow-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-3 py-2 border-b border-stone-800 text-xs font-bold text-stone-300">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Maximize2 className="w-3.5 h-3.5 text-[#ea583a]" />
                <span>Image Preview</span>
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[80vh] flex items-center justify-center">
              <img
                src={lightboxImage}
                alt="Enlarged preview"
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
