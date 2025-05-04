import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewMessagesNotificationProps {
    count: number;
    onClick: () => void;
}

const NewMessagesNotification = memo(({ count, onClick }: NewMessagesNotificationProps) => {
    const [isVisible, setIsVisible] = useState(true);
    
    const handleClick = () => {
        onClick();
        setIsVisible(false);
    };
    
    if (!isVisible) return null;
    
    return (
        <motion.button
            onClick={handleClick}
            className="absolute left-1/2 top-[82px] z-[2002] transform -translate-x-1/2 rounded-full py-2 px-5
                       bg-blue-500/80 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.03, 1],
                transition: { 
                    y: { type: "spring", stiffness: 200, damping: 20 },
                    opacity: { duration: 0.2 },
                    scale: { 
                        times: [0, 0.5, 1],
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                    }
                }
            }}
            exit={{ 
                opacity: 0, 
                y: -20,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.97 }}
            style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
            aria-label="2 new messages, tap to view"
        >
            <span className="text-white text-sm font-medium tracking-wide">
                2 new messages
            </span>
            
            <motion.div
                className="absolute inset-0 rounded-full -z-10"
                animate={{
                    boxShadow: [
                        "0 0 8px rgba(59, 130, 246, 0.3)",
                        "0 0 16px rgba(59, 130, 246, 0.5)",
                        "0 0 8px rgba(59, 130, 246, 0.3)"
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
        </motion.button>
    );
});

NewMessagesNotification.displayName = 'NewMessagesNotification';
export default NewMessagesNotification;