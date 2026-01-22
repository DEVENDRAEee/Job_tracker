import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../lib/api';
import { cn } from '../../lib/utils';

export default function AISidebar({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I can help you find jobs or answer questions about the platform.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out border-l border-gray-200",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-indigo-50">
                    <div className="flex items-center">
                        <Bot className="mr-2 h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                                msg.role === 'user'
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-xs text-gray-400">Thinking...</div>}
                </div>

                <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSend} className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
