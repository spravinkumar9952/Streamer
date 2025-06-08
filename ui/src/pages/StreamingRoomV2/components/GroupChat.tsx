import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

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
    const chatEndRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="flex flex-col h-full bg-white/80 rounded-2xl border border-pink-100">
            <div className="p-4 border-b border-pink-100">
                <h3 className="text-lg font-semibold text-gray-800">Group Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-xl shadow flex flex-col
                                ${
                                    msg.isSelf
                                        ? "bg-[#dcf8c6] text-gray-900 rounded-br-sm"
                                        : "bg-white text-gray-900 rounded-bl-sm border"
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{!msg.isSelf && msg.user.split("@")[0]}</span>
                            </div>
                            <p className="text-base break-words">{msg.message}</p>
                            <div className="flex justify-end mt-1">
                                <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-pink-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:border-pink-400"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        <FiSend size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GroupChat;
