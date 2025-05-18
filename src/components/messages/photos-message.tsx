import Image from "next/image";

interface PhotoType {
  src: string;
  alt?: string;
  caption?: string;
}

export const PhotosMessage = ({
  content,
  photos,
  bubbleClass,
  bubbleMaxWidth
}: {
  content?: string;
  photos: PhotoType[];
  bubbleClass: string;
  bubbleMaxWidth: string;
}) => {
  return (
    <div className={`${bubbleClass} px-3 py-2.5 ${bubbleMaxWidth} relative`}>
      {content && (
        <p className="text-[14px] leading-tight mb-2.5">{content}</p>
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        {photos.map((photo, index) => (
          <div key={index} className="w-[calc(50%-4px)] sm:w-[calc(33.333%-6px)] aspect-square rounded-md overflow-hidden relative group shadow-md">
            <Image
              src={photo.src}
              alt={photo.alt || `Photo ${index + 1}`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 150px"
              className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
              loading={index < 3 ? "eager" : "lazy"}
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/75 to-transparent">
                <p className="text-white text-[10px] leading-tight line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};