
import { useState } from 'react';
import { Message } from '@/types/chat';
import { fetchWithTimeout, FETCH_TIMEOUT } from '@/utils/fetchWithTimeout';
import { extractResponseContent } from '@/utils/responseHandler';
import { QueryClient } from '@tanstack/react-query';
import { handleApiResponse, handleApiError } from '@/utils/apiResponseHandler';
import { prepareFileData } from '@/utils/fileOperations';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export const useMessageSender = (
  updateSession: (sessionId: string, messages: Message[]) => void,
  queryClient: QueryClient
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (
    input: string,
    sessionId: string,
    currentMessages: Message[],
    file?: File
  ) => {
    console.log('Starting message send process', {
      hasFile: !!file,
      messageCount: currentMessages.length,
      sessionId
    });

    const effectiveWebhookUrl = window.env?.VITE_N8N_WEBHOOK_URL || import.meta.env.VITE_N8N_WEBHOOK_URL;
    const username = window.env?.VITE_N8N_WEBHOOK_USERNAME || import.meta.env.VITE_N8N_WEBHOOK_USERNAME;
    const secret = window.env?.VITE_N8N_WEBHOOK_SECRET || import.meta.env.VITE_N8N_WEBHOOK_SECRET;

    if (!effectiveWebhookUrl) {
      toast.error("Configuration error: No webhook URL available");
      return false;
    }

    setIsLoading(true);
    setIsTyping(true);

    try {
      // Deep clone the current messages to avoid reference issues
      const safeCurrentMessages = JSON.parse(JSON.stringify(currentMessages));
      console.log('Current messages state:', {
        count: safeCurrentMessages.length,
        lastMessage: safeCurrentMessages[safeCurrentMessages.length - 1]?.id
      });

      if (file) {
        console.log('Processing file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });
      }

      const fileData = file ? await prepareFileData(file) : null;
      console.log('File processing result:', {
        success: !!fileData,
        mimeType: fileData?.mimeType,
        dataSize: fileData?.data.length
      });

      const userMessage: Message = {
        id: uuidv4(),
        content: input,
        role: "user",
        timestamp: Date.now(),
        ...(fileData && { imageData: fileData })
      };

      console.log('Created user message:', {
        id: userMessage.id,
        hasImage: !!userMessage.imageData
      });

      const newMessages = [...safeCurrentMessages, userMessage];
      console.log('New messages array created:', {
        oldCount: safeCurrentMessages.length,
        newCount: newMessages.length
      });

      // Update UI before API call
      updateSession(sessionId, newMessages);
      queryClient.setQueryData(['chatSessions', sessionId], newMessages);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (username && secret) {
        const authString = `${username}:${secret}`;
        const base64Auth = btoa(authString);
        headers['Authorization'] = `Basic ${base64Auth}`;
      }

      console.log('Sending request to webhook...');
      const response = await fetchWithTimeout(
        effectiveWebhookUrl,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            chatInput: input,
            sessionId: sessionId,
            ...(fileData && {
              data: fileData.data,
              mimeType: fileData.mimeType,
              fileName: fileData.fileName
            })
          }),
        },
        FETCH_TIMEOUT
      );

      console.log('Webhook response received:', {
        status: response.status,
        ok: response.ok
      });

      const responseData = await handleApiResponse(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!responseData) {
        throw new Error('Empty response from server');
      }

      const responseContent = extractResponseContent(responseData);
      console.log('Extracted response content:', {
        contentLength: responseContent.length
      });

      const assistantMessage: Message = {
        id: uuidv4(),
        content: responseContent,
        role: "assistant",
        timestamp: Date.now(),
      };

      // Create final messages array and update UI
      const finalMessages = [...newMessages, assistantMessage];
      console.log('Final messages state:', {
        count: finalMessages.length,
        lastMessageId: assistantMessage.id
      });

      updateSession(sessionId, finalMessages);
      queryClient.setQueryData(['chatSessions', sessionId], finalMessages);
      
      console.log('Message send process completed successfully');
      return true;

    } catch (error) {
      console.error('Error in message send process:', error);
      toast.error("Failed to send message. Please try again.");
      return false;

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
