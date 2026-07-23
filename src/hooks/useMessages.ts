import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageType } from '@/lib/types';
import { generateInitialMessages } from '@/lib/data';

const TYPING_DELAY_FACTOR = 30;
const MIN_TYPING_DELAY = 1000;
const MAX_TYPING_DELAY = 1500;

/**
 * @param instant Skip the staggered reveal and load every message at once —
 * used when returning from another page (e.g. the blog), where re-watching
 * the intro would feel slow. First-time visits reveal messages one by one,
 * like they're arriving in iOS Messages.
 */
export function useMessages(instant: boolean) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  // The full set of scripted message ids, known upfront and set once —
  // unlike `messages`, this doesn't grow through the staggered reveal, so
  // consumers (e.g. the reactions fetch) don't refire on every reveal step.
  const [messageIds, setMessageIds] = useState<string[]>([]);

  useEffect(() => {
    const allMessages = generateInitialMessages();
    if (allMessages.length === 0) return;

    setMessageIds(allMessages.map((m) => m.id));

    if (instant) {
      setMessages(allMessages);
      return;
    }

    setMessages([allMessages[0]]);

    let index = 1;
    let timer: ReturnType<typeof setTimeout>;

    const revealNext = () => {
      if (index >= allMessages.length) return;
      const message = allMessages[index];
      const typingDelay = Math.min(
        MAX_TYPING_DELAY,
        Math.max(MIN_TYPING_DELAY, (message.content?.length || 0) * TYPING_DELAY_FACTOR)
      );

      setIsTyping(true);
      timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, message]);
        index += 1;
        revealNext();
      }, typingDelay);
    };

    revealNext();
    return () => clearTimeout(timer);
  }, [instant]);

  const addMessage = useCallback((content: string) => {
    const newMessage: MessageType = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: Date.now(),
      type: "text"
    };

    setMessages(prev => [...prev, newMessage]);

    return newMessage;
  }, []);

  return {
    messages,
    isTyping,
    addMessage,
    setIsTyping,
    messageIds,
  };
}