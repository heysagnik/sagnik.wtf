import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageType } from '@/lib/types';
import { generateInitialMessages } from '@/lib/data';

const TYPING_DELAY_FACTOR = 30;
const MIN_TYPING_DELAY = 1000;
const MAX_TYPING_DELAY = 1500;

export function useMessages() {
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setAllMessages(generateInitialMessages());
  }, []);

  useEffect(() => {
    if (allMessages.length === 0) return;
    
    if (currentIndex === 0) {
      setVisibleMessages([allMessages[0]]);
      setCurrentIndex(1);
      return;
    }
    
    if (currentIndex < allMessages.length) {
      setIsTyping(true);
      
      const message = allMessages[currentIndex];
      const contentLength = message.content?.length || 0;
      const typingDelay = Math.min(
        MAX_TYPING_DELAY, 
        Math.max(MIN_TYPING_DELAY, contentLength * TYPING_DELAY_FACTOR)
      );
      
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages(prev => [...prev, message]);
        setCurrentIndex(currentIndex + 1);
      }, typingDelay);
      
      return () => clearTimeout(typingTimer);
    }
  }, [currentIndex, allMessages]);

  const addMessage = useCallback((content: string) => {
    const newMessage: MessageType = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: Date.now(),
      type: "text"
    };
    
    setAllMessages(prev => [...prev, newMessage]);
    setVisibleMessages(prev => [...prev, newMessage]);
    
    return newMessage;
  }, []);

  const loadMoreMessages = useCallback((count: number = 3) => {
    return [...generateInitialMessages().slice(0, count)];
  }, []);

  return {
    messages: visibleMessages,
    isTyping,
    addMessage,
    loadMoreMessages,
    setAllMessages
  };
}