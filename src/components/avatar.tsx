import Image from "next/image"

interface AvatarProps {
  src: string
  alt: string
}

export default function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#3a3a3c] flex-shrink-0">
      <Image src={src || "/vercel.svg"} alt={alt} width={32} height={32} className="w-full h-full object-cover" />
    </div>
  )
}

