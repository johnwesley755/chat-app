import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Sticker } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useSocket } from "../../hooks/useSocket";
import AttachmentUpload from "./AttachmentUpload";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface MessageInputProps {
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<"emoji" | "sticker">("emoji");
  // Fix the chat context access
  const { state, actions: chatActions } = useChat() as any; // Use type assertion temporarily
  const socket = useSocket() as any; // Use type assertion for socket too
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", chatId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", chatId);
      setIsTyping(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      // Clean up timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (
      (!message.trim() && selectedFiles.length === 0) ||
      !chatActions.sendMessage
    )
      return;

    try {
      // If there are files, upload them first
      let attachments = [];

      if (selectedFiles.length > 0) {
        // Create FormData for file upload
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        // Upload files to server
        const response = await fetch("/api/messages/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to upload files");
        }

        const data = await response.json();
        attachments = data.attachments;
      }

      // Send message with attachments
      await chatActions.sendMessage(chatId, message, attachments);
      setMessage("");
      setSelectedFiles([]);

      // Stop typing indicator
      socket.emit("stop typing", chatId);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error notification
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: any) => {
    if (emoji.native) {
      // Regular emoji
      setMessage((prev) => prev + emoji.native);
    } else if (emoji.url) {
      // Sticker
      handleSendSticker(emoji);
    }
    setShowPicker(false);
  };

  const handleSendSticker = async (sticker: any) => {
    try {
      // Send sticker as an attachment
      const stickerAttachment = {
        type: "sticker",
        url: sticker.url,
        name: sticker.id,
        size: 0,
        contentType: "image/webp",
      };

      // Send message with sticker attachment
      await chatActions.sendMessage(chatId, "", [stickerAttachment]);

      // Stop typing indicator
      socket.emit("stop typing", chatId);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending sticker:", error);
    }
  };

  return (
    <div className="relative">
      {selectedFiles.length > 0 && (
        <div className="p-2 border-t dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {/* Selected files will be shown here */}
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <AttachmentUpload
          onFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
        />

        <div className="relative flex-1">
          {showPicker && (
            <div ref={pickerRef} className="absolute bottom-full mb-2 z-10">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                previewPosition="none"
                skinTonePosition="none"
                categories={pickerType === "sticker" ? ["stickers"] : undefined}
              />
            </div>
          )}

          <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-500">
            <div className="flex items-end">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 resize-none"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <div className="flex">
                <button
                  type="button"
                  onClick={() => {
                    setPickerType("emoji");
                    setShowPicker(!showPicker);
                  }}
                  className="p-3 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Smile size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPickerType("sticker");
                    setShowPicker(!showPicker);
                  }}
                  className="p-3 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Sticker size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && selectedFiles.length === 0}
          className={`p-3 rounded-full ${
            message.trim() || selectedFiles.length > 0
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
