import Image from 'next/image';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
       <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-0.5 border border-white/10 shadow-sm">
                <Image
                  src="/globe.svg"
                  alt="Avatar"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>

      <div className="bg-[#1c1c1e] px-4 py-2.5 rounded-2xl inline-flex items-center shadow-lg border border-gray-800">
        {/* <span className="text-gray-400 text-sm mr-2">typing</span> */}
        <div className="flex space-x-1">
          <div 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
            style={{animationDuration: '0.6s', animationDelay: '0ms'}}
          ></div>
          <div 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
            style={{animationDuration: '0.6s', animationDelay: '0.2s'}}
          ></div>
          <div 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
            style={{animationDuration: '0.6s', animationDelay: '0.4s'}}
          ></div>
        </div>
      </div>
    </div>
  )
}
