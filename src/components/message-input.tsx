import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MessageInputProps {
  onSend: (text: string) => void
  isEnabled: boolean
}

export default function MessageInput({ onSend, isEnabled }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + "px"
    }
  }, [inputValue])

  const handleSend = () => {
    if (inputValue.trim() && isEnabled) {
      onSend(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && isEnabled) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 py-3 bg-[#1A1A1C] border-t border-gray-800"><motion.div
      className="flex items-end gap-2 relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex-grow flex items-center bg-[#1C1C1E] rounded-3xl px-1 
          ${isFocused ? 'ring-1 ring-blue-500' : ''}`}>

        <textarea
          ref={textareaRef}
          className={`flex-grow bg-transparent text-white/90 px-3 py-2 outline-none text-sm resize-none
              ${!isEnabled ? 'opacity-50' : ''}`}
          placeholder="iMessage"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={!isEnabled}
          style={{ minHeight: "36px", maxHeight: "120px" }} />

        <AnimatePresence>
          {(inputValue.trim()) && (
            <motion.button
              onClick={handleSend}
              disabled={!isEnabled || !inputValue.trim()}
              className="pr-3 pl-1 py-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <div className={`rounded-full p-1.5 ${isEnabled && inputValue.trim() ? 'bg-[#0084FF]' : 'bg-gray-600'}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="m5 12 l14 0" />
                  <path d="m12 5 l7 7 l-7 7" />
                </svg>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {!inputValue.trim() && (
        <motion.button
          className="text-[#0084FF] px-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </motion.button>
      )}

    </motion.div>
  </div>
    
  
  )
}