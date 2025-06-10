import React, { useRef, useEffect, useState } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
import Picker from "@emoji-mart/react";

interface ChatMessage {
    user: string;
    time: string;
    message: string;
    isSelf?: boolean;
}

interface GroupChatProps {
    chat: ChatMessage[];
    onSend: (message: string) => void;
}

const GroupChat: React.FC<GroupChatProps> = ({ chat, onSend }) => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        setMessage((prev) => prev + (emoji.native || emoji.emojis || ""));
        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full bg-background-card rounded-card border border-border-light">
            <div className="p-4 border-b border-border-light">
                <h2 className="text-lg font-semibold text-text-primary">Group Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(100vh - 16rem)" }}>
                {chat.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}>
                        {msg.user !== "System" && (
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-text-secondary">
                                    {msg.user.split("@")[0]}
                                </span>
                                <span className="text-xs text-text-tertiary">{msg.time}</span>
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-card px-4 py-2 ${
                                msg.user === "System"
                                    ? "bg-background-tertiary text-text-secondary text-sm"
                                    : msg.isSelf
                                    ? "bg-button-primary-background text-button-primary-text"
                                    : "bg-background-tertiary text-text-primary"
                            }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-border-light relative">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center flex-nowrap w-full">
                    {showEmojiPicker && (
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full">
                            <Picker onEmojiSelect={handleEmojiSelect} theme="auto" />
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 min-w-0 bg-input-background border border-input-border rounded-button px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-input-focus"
                    />
                    <button
                        type="button"
                        className="px-2 py-2 rounded-button hover:bg-background-tertiary transition-colors flex-shrink-0"
                        onClick={() => setShowEmojiPicker((v) => !v)}
                        tabIndex={-1}
                    >
                        <FiSmile className="w-6 h-6 text-text-tertiary" />
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-button-primary-background text-button-primary-text rounded-button hover:bg-button-primary-hover transition-colors flex-shrink-0"
                    >
                        <FiSend />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupChat;
