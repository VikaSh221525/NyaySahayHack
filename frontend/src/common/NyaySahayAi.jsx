import { useState, useEffect, useRef } from 'react';
import { 
    Plus, 
    User, 
    Send, 
    Scale, 
    Trash2, 
    Edit3, 
    Menu, 
    X, 
    Copy,
    MessageCircle,
    Gavel
} from 'lucide-react';
import { useChats, useCreateChat, useMessages } from '../hooks/useChatQuery.js';
import { useSocket } from '../hooks/useSocket.js';
import { useAuthStatus } from '../hooks/useAuthQuery.js';

// Component to format AI messages with proper styling
const FormattedMessage = ({ content, type }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatText = (text) => {
        // Handle code blocks
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.slice(lastIndex, match.index)
                });
            }

            parts.push({
                type: 'code',
                language: match[1] || '',
                content: match[2].trim()
            });

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex)
            });
        }

        if (parts.length === 0) {
            parts.push({
                type: 'text',
                content: text
            });
        }

        return parts.map((part, partIndex) => {
            if (part.type === 'code') {
                return (
                    <div key={partIndex} className="my-4 relative group">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-xs text-gray-300 font-medium ml-2">
                                        {part.language || 'code'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(part.content)}
                                    className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-gray-700 flex items-center gap-1.5"
                                >
                                    <Copy className="text-xs" />
                                    Copy
                                </button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="text-sm leading-relaxed">
                                    <code className="text-gray-100 whitespace-pre block">
                                        {part.content}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                );
            }

            // Handle regular text formatting
            const paragraphs = part.content.split('\n\n');
            return paragraphs.map((paragraph, pIndex) => {
                if (!paragraph.trim()) return null;

                const lines = paragraph.split('\n');
                return (
                    <div key={`${partIndex}-${pIndex}`} className={pIndex > 0 ? 'mt-4' : ''}>
                        {lines.map((line, lIndex) => {
                            // Bullet points
                            if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                                return (
                                    <div key={lIndex} className="flex items-start gap-2 my-1">
                                        <span className="text-indigo-400 mt-1">•</span>
                                        <span>{line.replace(/^[•\-*]\s*/, '')}</span>
                                    </div>
                                );
                            }
                            // Numbered lists
                            else if (line.match(/^\d+\./)) {
                                return (
                                    <div key={lIndex} className="flex items-start gap-2 my-1">
                                        <span className="text-indigo-400 font-medium">
                                            {line.match(/^\d+\./)[0]}
                                        </span>
                                        <span>{line.replace(/^\d+\.\s*/, '')}</span>
                                    </div>
                                );
                            }
                            // Headers
                            else if (line.trim().startsWith('#')) {
                                const headerLevel = line.match(/^#+/)[0].length;
                                const headerText = line.replace(/^#+\s*/, '');
                                const headerClass = headerLevel === 1 
                                    ? 'text-xl font-bold text-white mt-4 mb-2' 
                                    : headerLevel === 2 
                                    ? 'text-lg font-semibold text-white mt-3 mb-2' 
                                    : 'text-base font-medium text-white mt-2 mb-1';
                                
                                return (
                                    <div key={lIndex} className={headerClass}>
                                        {headerText}
                                    </div>
                                );
                            }
                            // Inline code
                            else if (line.includes('`') && line.split('`').length > 2) {
                                const parts = line.split('`');
                                return (
                                    <div key={lIndex} className={lIndex > 0 ? 'mt-1' : ''}>
                                        {parts.map((part, partIndex) =>
                                            partIndex % 2 === 1 ? (
                                                <code key={partIndex} className="bg-gray-800/80 text-emerald-400 px-2 py-0.5 rounded-md text-sm font-mono border border-gray-700">
                                                    {part}
                                                </code>
                                            ) : (
                                                <span key={partIndex}>{part}</span>
                                            )
                                        )}
                                    </div>
                                );
                            }
                            // Empty lines
                            else if (line.trim() === '') {
                                return <div key={lIndex} className="h-2"></div>;
                            }
                            // Regular text with bold/italic formatting
                            else {
                                let formattedLine = line;
                                formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
                                formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
                                
                                return (
                                    <div
                                        key={lIndex}
                                        className={lIndex > 0 ? 'mt-1' : ''}
                                        dangerouslySetInnerHTML={{ __html: formattedLine }}
                                    />
                                );
                            }
                        })}
                    </div>
                );
            }).filter(Boolean);
        }).flat();
    };

    if (type === 'user') {
        return <div className="whitespace-pre-wrap">{content}</div>;
    }

    return (
        <div className="relative group">
            <div className="prose prose-invert max-w-none">
                {formatText(content)}
            </div>
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white"
                title="Copy message"
            >
                {copied ? (
                    <span className="text-xs">✓</span>
                ) : (
                    <Copy className="text-xs" />
                )}
            </button>
        </div>
    );
};

const TypingAnimation = () => (
    <div className="flex space-x-1 p-4">
        <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
    </div>
);

const NyaySahayAi = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [currentChatId, setCurrentChatId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Hooks
    const { data: authData } = useAuthStatus();
    const { data: chatsData, isLoading: chatsLoading } = useChats();
    const { data: messagesData, isLoading: messagesLoading } = useMessages(currentChatId);
    const createChatMutation = useCreateChat();
    const { 
        isConnected, 
        connect, 
        disconnect, 
        sendMessage, 
        onAIResponse, 
        onAIError,
        offAIResponse,
        offAIError 
    } = useSocket();

    const user = authData?.user;
    const chatHistory = chatsData?.chats || [];

    // Connect socket on mount
    useEffect(() => {
        connect();
        return () => disconnect();
    }, []);

    // Socket event listeners
    useEffect(() => {
        const handleAIResponse = (response) => {
            setIsTyping(false);
            const aiMessage = {
                id: Date.now(),
                type: 'ai',
                content: response.content,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        };

        const handleAIError = (error) => {
            setIsTyping(false);
            console.error('AI Error:', error);
        };

        onAIResponse(handleAIResponse);
        onAIError(handleAIError);

        return () => {
            offAIResponse();
            offAIError();
        };
    }, []);

    // Load messages when chat changes
    useEffect(() => {
        if (messagesData?.messages) {
            const formattedMessages = messagesData.messages.map(msg => ({
                id: msg._id,
                type: msg.role === 'user' ? 'user' : 'ai',
                content: msg.content,
                timestamp: new Date(msg.createdAt)
            }));
            setMessages(formattedMessages);
        }
    }, [messagesData]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !currentChatId || !isConnected) return;

        const messageContent = inputMessage.trim();
        
        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: messageContent,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Send to AI
        sendMessage(currentChatId, messageContent);
    };

    const startNewChat = async () => {
        const title = window.prompt('Enter a title for your legal consultation:', 'Legal Consultation');
        if (!title || title.trim() === '') return;

        try {
            const newChat = await createChatMutation.mutateAsync(title.trim());
            setCurrentChatId(newChat._id);
            setMessages([]);
            setIsTyping(false);
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const selectChat = (chatId) => {
        setCurrentChatId(chatId);
        setMessages([]);
        setIsTyping(false);
        
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-gradient-to-br from-slate-50 to-indigo-50 overflow-hidden">
            {/* Mobile Overlay */}
            {sidebarOpen && window.innerWidth <= 768 && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${
                sidebarOpen ? 'w-80 lg:w-80 md:w-72 sm:w-64' : 'w-0'
            } ${
                window.innerWidth <= 768 ? 'fixed left-0 top-0 h-full z-50' : 'relative'
            } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-lg`}>
                
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <button
                        onClick={startNewChat}
                        disabled={createChatMutation.isPending}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50"
                    >
                        <Plus className="text-sm" />
                        {createChatMutation.isPending ? 'Creating...' : 'New Legal Chat'}
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-600 text-sm font-medium px-2">
                            Recent Consultations
                        </h3>
                        {chatsLoading && (
                            <div className="text-indigo-500 text-xs">Loading...</div>
                        )}
                    </div>

                    {!chatsLoading && chatHistory.length === 0 && (
                        <div className="text-center py-8">
                            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No consultations yet</p>
                            <p className="text-gray-400 text-xs mt-1">Start your first legal chat!</p>
                        </div>
                    )}

                    {chatHistory.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => selectChat(chat._id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                                currentChatId === chat._id
                                    ? 'bg-indigo-50 border border-indigo-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-gray-900 text-sm font-medium truncate">
                                        {chat.title}
                                    </h4>
                                    <p className="text-gray-500 text-xs truncate mt-1">
                                        Legal consultation
                                    </p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                        <Edit3 className="text-xs" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <X /> : <Menu />}
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">JusticeAI</h1>
                                <p className="text-sm text-gray-500">Your Legal Assistant</p>
                            </div>
                        </div>
                    </div>

                    <div className={`text-xs px-3 py-1 rounded-full ${
                        isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {isConnected ? '● Connected' : '● Disconnected'}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 && !currentChatId ? (
                        // Welcome Screen
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                                <Gavel className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Welcome to <span className="text-indigo-600">JusticeAI</span>
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mb-8">
                                Your intelligent legal assistant ready to help you understand your rights, 
                                legal procedures, and provide guidance on legal matters in India.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <h3 className="font-semibold text-indigo-900 mb-2">Ask Legal Questions</h3>
                                    <p className="text-sm text-indigo-700">Get explanations about Indian laws and your rights</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2">Legal Procedures</h3>
                                    <p className="text-sm text-blue-700">Learn about court processes and legal remedies</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Chat Messages
                        <div className="p-4 lg:p-6 space-y-6">
                            {messagesLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-indigo-500">
                                        <TypingAnimation />
                                        <p className="text-sm mt-2 text-center">Loading messages...</p>
                                    </div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center items-center py-8">
                                    <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 lg:gap-4 ${
                                            message.type === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {message.type === 'ai' && (
                                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Scale className="text-white text-base" />
                                            </div>
                                        )}
                                        
                                        <div className={`max-w-[85%] lg:max-w-4xl ${message.type === 'user' ? 'order-1' : ''}`}>
                                            <div
                                                className={`relative p-4 lg:p-5 rounded-2xl ${
                                                    message.type === 'user'
                                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white ml-auto'
                                                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                                }`}
                                            >
                                                <FormattedMessage content={message.content} type={message.type} />
                                            </div>
                                            <div className={`text-xs text-gray-500 mt-2 ${
                                                message.type === 'user' ? 'text-right' : 'text-left'
                                            }`}>
                                                {message.timestamp.toLocaleTimeString()}
                                            </div>
                                        </div>

                                        {message.type === 'user' && (
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 order-2">
                                                <User className="text-gray-600 text-sm" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* Typing Animation */}
                            {isTyping && (
                                <div className="flex gap-3 lg:gap-4 justify-start">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Scale className="text-white text-sm" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl">
                                        <TypingAnimation />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {currentChatId ? (
                    <div className="p-4 lg:p-6 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex gap-3 lg:gap-4 items-center">
                            <div className="flex-1 relative">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask JusticeAI about your legal rights..."
                                    className="w-full p-3 lg:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none min-h-[50px] lg:min-h-[60px] max-h-32"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping || !isConnected}
                                className="p-3 lg:p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
                            >
                                <Send className="text-sm lg:text-lg" />
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-2 text-center px-2">
                            JusticeAI provides legal information, not legal advice. Consult with qualified advocates for specific legal matters.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 lg:p-6 border-t border-gray-200 bg-white">
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm mb-2">
                                Select a chat or create a new one to start your legal consultation
                            </p>
                            <button
                                onClick={startNewChat}
                                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                            >
                                Start Legal Consultation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NyaySahayAi;