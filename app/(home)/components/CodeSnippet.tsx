"use client";

import React, { useState } from "react";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import TimelineStore from "@/stores/timeline-store";

interface CodeSnippetProps {
  src?: string;
  title?: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({
  title = "Linea Timeline Embed",
}) => {
  const { setEmbedUrl, embedUrl } = TimelineStore();
  const [copied, setCopied] = useState(false);

  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="500" 
  frameborder="0" 
  allowfullscreen 
  title="${title}">
</iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  if (!embedUrl) return null;

  return (
    <>
      <div className="w-full max-w-2xl mx-auto overflow-hidden border border-(--accent) rounded-xl bg-(--secondary-background) shadow-sm fixed top-[30%] z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-(--secondary-background) border-(--accent)">
          <span className="text-sm font-semibold text-(--accent)">
            Embed Code
          </span>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-md border ${
              copied
                ? "bg-emerald-600 text-white border-emerald-200"
                : "bg-(--accent) text-white border-(--accent) hover:bg-(--accent-hover)"
            }`}
          >
            {copied ? (
              <CheckIcon className="w-5" />
            ) : (
              <DocumentDuplicateIcon className="w-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="p-5 overflow-x-auto text-sm leading-relaxed text-slate-100 font-mono scrollbar-thin scrollbar-thumb-slate-300">
            <code className="whitespace-pre">{iframeCode}</code>
          </pre>
        </div>
      </div>
      <div
        className="w-screen h-screen fixed top-0 left-0"
        onClick={() => setEmbedUrl(undefined)}
      />
    </>
  );
};

export default CodeSnippet;
