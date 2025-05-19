import React, { JSX, useCallback, useMemo } from 'react';

// Regex pattern for URLs
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

// Regex patterns for basic markdown
const MD_PATTERNS = {
  BOLD: /\*\*(.*?)\*\*|__(.*?)__/g,
  ITALIC: /\*(.*?)\*|_(.*?)_/g,
  CODE: /`([^`]+)`/g,
  LINK: /\[([^\]]+)\]\(([^)]+)\)/g,
  HEADER: /^(#{1,3})\s+(.+)$/gm
};

export const TextMessage = ({
  content,
  bubbleClass,
  bubbleMaxWidth
}: {
  content: string;
  bubbleClass: string;
  bubbleMaxWidth: string;
}) => {
  // Helper function to process regex matches on text parts
  const processRegex = useCallback(
    (
      parts: Array<string | React.ReactNode>,
      regex: RegExp,
      createNode: (fullMatch: string, ...capturedGroupsAndCounter: [...(string | undefined)[], number]) => React.ReactNode
    ): Array<string | React.ReactNode> => {
      const result: Array<string | React.ReactNode> = [];
      let nodeCounter = 0;
      
      for (const part of parts) {
        // Skip parts that are already React nodes
        if (typeof part !== 'string') {
          result.push(part);
          continue;
        }
        
        let lastIndex = 0;
        const text = part;
        let match;
        
        // Reset regex
        regex.lastIndex = 0;
        
        while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            result.push(text.substring(lastIndex, match.index));
          }
          
          // Create the React node for the matched pattern with unique index
          const capturedGroups = match.slice(1);
          result.push(createNode(match[0], ...capturedGroups, nodeCounter++));
          
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < text.length) {
          result.push(text.substring(lastIndex));
        }
      }
      
      return result;
    },
    []
  );

  // Process a single line of text for inline formatting
  const processLine = useCallback(
    (text: string, parentKey: string): React.ReactNode[] => {
      let parts: Array<string | React.ReactNode> = [text];
      
      // Process code blocks
      parts = processRegex(parts, MD_PATTERNS.CODE, (match, ...rest) => {
        const idx = rest.pop() as number;
        const codeContent = rest[0];
        return (
          <code key={`${parentKey}-code-${idx}`} className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[14px] font-mono">
            {codeContent}
          </code>
        );
      });
      
      // Process links (both markdown and plain URLs)
      parts = processRegex(parts, MD_PATTERNS.LINK, (match, ...rest) => {
        const idx = rest.pop() as number;
        const [linkText = "", url = ""] = rest.map(item => 
          typeof item === 'string' ? item : String(item || '')
        );
        
        return (
          <a 
            key={`${parentKey}-link-${idx}`}
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 underline decoration-[0.5px] underline-offset-[1.5px]"
          >
            {linkText}
          </a>
        );
      });
      
      // Process URLs that aren't already in markdown link format
      parts = processRegex(parts, URL_REGEX, (match, ...rest) => { // Capture groups from URL_REGEX are _wwwGroup and _pathGroup
        const idx = rest.pop() as number; // The counter is always the last element
        // const [_wwwGroup, _pathGroup] = rest; // The captured groups
        
        const url = match.startsWith('http') ? match : `https://${match}`;
        const displayUrl = match.length > 35 ? `${match.substring(0, 32)}...` : match;
        
        return (
          <a 
            key={`${parentKey}-url-${idx}`}
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 underline decoration-[0.5px] underline-offset-[1.5px]"
          >
            {displayUrl}
          </a>
        );
      });
      
      // Process bold text
      parts = processRegex(parts, MD_PATTERNS.BOLD, (match, ...rest) => {
        const idx = rest.pop() as number;
        const content1 = rest[0];
        const content2 = rest[1];
        return (
          <strong key={`${parentKey}-bold-${idx}`} className="font-semibold">
            {content1 || content2}
          </strong>
        );
      });
      
      // Process italic text
      parts = processRegex(parts, MD_PATTERNS.ITALIC, (match, ...rest) => {
        const idx = rest.pop() as number;
        const content1 = rest[0];
        const content2 = rest[1];
        return (
          <em key={`${parentKey}-italic-${idx}`} className="italic">
            {content1 || content2}
          </em>
        );
      });
      
      // Add keys to any remaining string parts
      return parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <span key={`${parentKey}-text-${idx}`}>{part}</span>;
        }
        return part;
      });
    },
    [processRegex]
  );

  // Process text to render markdown and links
  const formatMessage = useCallback(
    (text: string): React.ReactNode[] => {
      try {
        // First, split by line breaks to handle them properly
        const lines = text.split('\n');
        
        return lines.map((line, lineIndex) => {
          // Skip empty lines
          if (line.trim() === '') {
            return <div key={`empty-${lineIndex}`} className="h-[0.5em]" aria-hidden="true" />;
          }
          
          // Process headers first
          const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
          if (headerMatch) {
            const level = headerMatch[1].length;
            const headerContent = processLine(headerMatch[2], `header-${lineIndex}`);
            
            const headerClasses = {
              1: "text-xl font-bold my-1.5",
              2: "text-lg font-bold my-1",
              3: "text-base font-semibold my-0.5"
            };
            
            const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
            return <HeaderTag key={`h${level}-${lineIndex}`} className={headerClasses[level as 1|2|3]}>{headerContent}</HeaderTag>;
          }
          
          // Process normal lines
          return (
            <div 
              key={`line-${lineIndex}`} 
              className={lineIndex < lines.length - 1 ? "mb-[0.35em]" : ""}
            >
              {processLine(line, `line-${lineIndex}`) || " "}
            </div>
          );
        });
      } catch (error) {
        console.error("Error formatting message:", error);
        return [<span key="error" className="text-red-500">Message could not be displayed</span>];
      }
    },
    [processLine]
  );
  
  const formattedContent = useMemo(() => formatMessage(content), [content, formatMessage]);
  const isUserBubble = bubbleClass.includes('bubble-sent');
  const isDarkMode = bubbleClass.includes('dark') || bubbleClass.includes('theme-dark');

  return (
    <div 
      className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative group`}
      data-testid="text-message"
    >
      <div 
        className="text-[16px] leading-[21px] font-[-apple-system,BlinkMacSystemFont,sans-serif] selection:bg-blue-200 dark:selection:bg-blue-800 selection:text-current"
        style={{
          WebkitTouchCallout: 'default',
          WebkitUserSelect: 'text',
          userSelect: 'text',
          wordBreak: 'break-word',
        }}
      >
        {formattedContent}
      </div>
      
      <style jsx>{`
        @media (hover: hover) {
          .group:active::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: ${isUserBubble 
              ? 'rgba(255,255,255,0.1)' 
              : isDarkMode 
                ? 'rgba(255,255,255,0.07)' 
                : 'rgba(0,0,0,0.05)'
            };
            border-radius: inherit;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
};