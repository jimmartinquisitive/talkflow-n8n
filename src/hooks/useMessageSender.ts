import { useState } from 'react';
import { useToast } from './use-toast';
import { Message } from '@/types/chat';
import { fetchWithTimeout, FETCH_TIMEOUT } from '@/utils/fetchWithTimeout';
import { extractResponseContent } from '@/utils/responseHandler';
import { QueryClient } from '@tanstack/react-query';

export const useMessageSender = (
  updateSession: (sessionId: string, messages: Message[]) => void,
  queryClient: QueryClient
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    input: string,
    sessionId: string,
    currentMessages: Message[],
    file?: File
  ) => {
    const effectiveWebhookUrl = window.env?.VITE_N8N_WEBHOOK_URL || import.meta.env.VITE_N8N_WEBHOOK_URL;
    const username = window.env?.VITE_N8N_WEBHOOK_USERNAME || import.meta.env.VITE_N8N_WEBHOOK_USERNAME;
    const secret = window.env?.VITE_N8N_WEBHOOK_SECRET || import.meta.env.VITE_N8N_WEBHOOK_SECRET;

    console.log('useMessageSender sendMessage called with:', {
      input,
      sessionId,
      hasFile: !!file,
      fileDetails: file ? {
        name: file.name,
        size: file.size,
        type: file.type
      } : null
    });

    if (!effectiveWebhookUrl) {
      console.error('No webhook URL provided in environment');
      toast({
        description: "Configuration error: No webhook URL available",
        variant: "destructive",
      });
      return;
    }

    console.log('Selected WEBHOOK_URL:', effectiveWebhookUrl);

    setIsLoading(true);
    setIsTyping(true);

    let imageData;
    if (file) {
      try {
        const base64Data = await fileToBase64(file);
        imageData = {
          data: base64Data,
          mimeType: file.type,
          fileName: file.name
        };
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          description: "Error processing image file",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsTyping(false);
        return;
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      role: "user",
      timestamp: Date.now(),
      ...(imageData && { imageData })
    };

    const newMessages = [...currentMessages, userMessage];
    updateSession(sessionId, newMessages);
    queryClient.setQueryData(['chatSessions', sessionId], newMessages);

    try {
      // Prepare headers with authentication
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Only add authentication if both username and secret are present
      if (username && secret) {
        const authString = `${username}:${secret}`;
        const base64Auth = btoa(authString);
        headers['Authorization'] = `Basic ${base64Auth}`;
      }

      const response = await fetchWithTimeout(
        effectiveWebhookUrl,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            chatInput: input,
            sessionId: sessionId,
            ...(file && {
              data: await fileToBase64(file),
              mimeType: file.type,
              fileName: file.name
            })
          }),
        },
        FETCH_TIMEOUT
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseContent = extractResponseContent(data);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: responseContent,
        role: "assistant",
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      updateSession(sessionId, finalMessages);
      queryClient.setQueryData(['chatSessions', sessionId], finalMessages);
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error in webhook request:', error);
      let errorMessage = "Error sending message";
      
      if (error instanceof Error) {
        if (error.message === 'Request timed out') {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.message.includes('401')) {
          errorMessage = "Authentication failed. Please check your credentials.";
        }
      }
      
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    isTyping
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};