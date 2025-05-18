export const TextMessage = ({
  content,
  bubbleClass,
  bubbleMaxWidth
}: {
  content: string;
  bubbleClass: string;
  bubbleMaxWidth: string;
}) => {
  return (
    <div className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative`}>
      <p className="text-[16px] leading-[21px] font-[-apple-system,BlinkMacSystemFont,sans-serif] whitespace-pre-line">
        {content}
      </p>
    </div>
  );
};