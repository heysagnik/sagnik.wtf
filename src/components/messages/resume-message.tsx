export const ResumeMessage = ({
  content,
  resumeLink,
  resumeLinkText,
  bubbleClass,
  bubbleMaxWidth,
  isUser
}: {
  content?: string;
  resumeLink: string;
  resumeLinkText?: string;
  bubbleClass: string;
  bubbleMaxWidth: string;
  isUser: boolean;
}) => {
  return (
    <div className={`${bubbleClass} px-4 py-3 ${bubbleMaxWidth} relative`}>
      {content && (
        <p className="text-[14px] leading-tight mb-2.5">{content}</p>
      )}
      <a
        href={resumeLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${isUser 
          ? 'bg-white/20 text-white hover:bg-white/30 active:bg-white/40' 
          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'} 
          rounded-lg py-2.5 px-4 text-sm font-medium flex items-center justify-center mt-1.5 transition-all duration-200 group w-full sm:w-auto text-center shadow-md`}
      >
        {resumeLinkText || "View Resume"}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-80 group-hover:opacity-100 transition-opacity" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </a>
    </div>
  );
};