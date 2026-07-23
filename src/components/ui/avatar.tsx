import Image from "next/image";

// Assistant avatar for the last bubble in a consecutive run, or the typing
// indicator when a reply is in flight. `visible={false}` keeps the layout
// slot reserved without rendering the image, so rows in the same group stay
// aligned.
export const Avatar = ({ visible = true }: { visible?: boolean }) => {
  if (!visible) {
    return <div className="w-6 h-6 flex-shrink-0 mb-1" aria-hidden="true" />;
  }

  return (
    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1 border border-white/10 shadow-sm">
      <Image
        src="/char.png"
        alt="Assistant avatar"
        width={24}
        height={24}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
};
