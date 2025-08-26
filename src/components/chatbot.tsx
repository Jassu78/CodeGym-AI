'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, User, Send, X, Maximize2, Minimize2, MessageSquare, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { SafeMarkdown } from '@/components/ui/safe-markdown';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  responseLength?: 'short' | 'medium' | 'full';
}

export interface ChatbotProps {
  onSendMessage: (message: string, responseLength: 'short' | 'medium' | 'full') => void;
  messages: ChatMessage[];
  isTyping: boolean;
  onNewChat: () => void;
  onBotResponse?: (message: ChatMessage) => void;
}

type ChatMode = 'mini' | 'expanded' | 'fullscreen';

export function Chatbot({ onSendMessage, messages, isTyping, onNewChat, onBotResponse }: ChatbotProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'full'>('medium');
  const [chatMode, setChatMode] = useState<ChatMode>('mini');
  const [unreadCount, setUnreadCount] = useState(0);
  const [localChatHistory, setLocalChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatbot-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setLocalChatHistory(parsed);
      } catch (error) {
        console.error('Failed to parse saved chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (localChatHistory.length > 0) {
      localStorage.setItem('chatbot-history', JSON.stringify(localChatHistory));
    }
  }, [localChatHistory]);

  // Add bot responses from parent component to local history
  useEffect(() => {
    if (messages.length > 0 && onBotResponse) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && !localChatHistory.some(msg => msg.id === lastMessage.id)) {
        setLocalChatHistory(prev => [...prev, lastMessage]);
      }
    }
  }, [messages, onBotResponse, localChatHistory]);

  // Track unread messages when in mini mode
  useEffect(() => {
    if (chatMode === 'mini' && localChatHistory.length > 0) {
      const lastMessage = localChatHistory[localChatHistory.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [localChatHistory, chatMode]);

  // Reset unread count when expanding
  useEffect(() => {
    if (chatMode !== 'mini') {
      setUnreadCount(0);
    }
  }, [chatMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localChatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: inputMessage.trim(),
        timestamp: new Date(),
        responseLength,
      };

      // Add user message to local history
      setLocalChatHistory(prev => [...prev, userMessage]);
      
      // Call the parent's onSendMessage
      onSendMessage(inputMessage.trim(), responseLength);
      setInputMessage('');
      
      // Focus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNewChat = () => {
    setLocalChatHistory([]);
    localStorage.removeItem('chatbot-history');
    onNewChat();
  };

  const cycleChatMode = () => {
    setChatMode(prev => {
      switch (prev) {
        case 'mini': return 'expanded';
        case 'expanded': return 'fullscreen';
        case 'fullscreen': return 'mini';
        default: return 'mini';
      }
    });
  };

  const quickPrompts = [
    'How do I approach this problem?',
    'What\'s the time complexity?',
    'Can you explain this algorithm?',
    'Show me an example',
    'What are the edge cases?'
  ];

  // Use local chat history for display
  const displayMessages = localChatHistory.length > 0 ? localChatHistory : messages;

  // Mini mode (floating chat icon)
  if (chatMode === 'mini') {
    return (
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Button
          onClick={cycleChatMode}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg border-2 border-primary/20 bg-primary hover:bg-primary/90 transition-all duration-200"
        >
          <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  // Expanded mode (medium chat window)
  if (chatMode === 'expanded') {
    return (
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Card className="w-80 sm:w-96 h-[500px] shadow-xl border-2 border-primary/20">
          <CardHeader className="p-3 sm:p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">AI Coding Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={onNewChat} className="h-6 w-6 p-0 text-xs">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={cycleChatMode} className="h-6 w-6 p-0 text-xs">
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={cycleChatMode} className="h-6 w-6 p-0 text-xs">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Quick Prompts */}
            {displayMessages.length === 0 && (
              <div className="px-3 sm:px-4 pb-4">
                <div className="text-center text-sm text-muted-foreground mb-3">
                  💡 <strong>No problem selected yet!</strong><br/>
                  Generate a problem first to get started with coding practice.
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onSendMessage(prompt, responseLength)}
                      className="h-auto p-2 text-xs justify-start text-left break-words"
                      disabled={isTyping}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 space-y-3" style={{ maxHeight: 'calc(500px - 200px)' }}>
              {displayMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2',
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {msg.sender === 'bot' && (
                    <Avatar className="w-6 h-6 bg-primary text-white flex-shrink-0">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn(
                    'flex-1 min-w-0',
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  )}>
                    <div className={cn(
                      'inline-block p-2 rounded-lg max-w-full break-words',
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border'
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-xs">
                          {msg.sender === 'user' ? 'You' : 'AI'}
                        </span>
                        {msg.responseLength && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {msg.responseLength}
                          </Badge>
                        )}
                      </div>
                      
                      {msg.sender === 'bot' ? (
                        <div className="text-xs prose prose-sm max-w-none">
                          <SafeMarkdown variant="compact">{msg.text}</SafeMarkdown>
                        </div>
                      ) : (
                        <div className="text-xs text-current break-words">
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <Avatar className="w-6 h-6 bg-muted text-muted-foreground flex-shrink-0">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <Avatar className="w-6 h-6 bg-primary text-white flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted border rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section - Fixed positioning at bottom */}
            <div className="border-t p-3 mt-auto">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Select value={responseLength} onValueChange={(value: 'short' | 'medium' | 'full') => setResponseLength(value)}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 h-8 text-xs"
                  disabled={isTyping}
                />
                <Button type="submit" size="sm" className="h-8 w-8 p-0" disabled={!inputMessage.trim() || isTyping}>
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fullscreen mode
  if (chatMode === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b bg-muted/30 p-3 sm:p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Coding Assistant</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onNewChat} className="h-8 px-2 text-xs">
                  New Chat
                </Button>
                <Button variant="outline" onClick={cycleChatMode} className="h-8 px-2 text-xs">
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Minimize
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                {displayMessages.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Bot className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome to AI Coding Assistant!</h2>
                    <p className="text-muted-foreground mb-4 sm:mb-6">
                      Ask me anything about coding, algorithms, or your current problem.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {quickPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => onSendMessage(prompt, responseLength)}
                          className="h-auto p-3 text-left justify-start break-words"
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  displayMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3 sm:gap-4 max-w-4xl mx-auto',
                        msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {msg.sender === 'bot' && (
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white flex-shrink-0">
                          <AvatarFallback className="bg-primary text-white">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn(
                        'flex-1 min-w-0 max-w-3xl',
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      )}>
                        <div className={cn(
                          'inline-block p-3 sm:p-4 rounded-2xl max-w-full break-words',
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border'
                        )}>
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <span className="font-medium text-sm">
                              {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            {msg.responseLength && (
                              <Badge variant="secondary" className="text-xs">
                                {msg.responseLength}
                              </Badge>
                            )}
                          </div>
                          
                          {msg.sender === 'bot' ? (
                            <div className="prose prose-sm max-w-none">
                              <SafeMarkdown variant="prose">{msg.text}</SafeMarkdown>
                            </div>
                          ) : (
                            <div className="text-sm text-current break-words">
                              {msg.text}
                            </div>
                          )}
                        </div>
                      </div>

                      {msg.sender === 'user' && (
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-muted text-muted-foreground flex-shrink-0">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                
                {isTyping && (
                  <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white flex-shrink-0">
                      <AvatarFallback className="bg-primary text-white">
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted border rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <span className="font-medium text-sm">AI Assistant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section */}
              <div className="border-t bg-muted/30 p-3 sm:p-4 lg:p-6">
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
                    <div className="flex-1 flex gap-2">
                      <Select value={responseLength} onValueChange={(value: 'short' | 'medium' | 'full') => setResponseLength(value)}>
                        <SelectTrigger className="w-24 sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me anything about coding..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                    </div>
                    <Button type="submit" disabled={!inputMessage.trim() || isTyping}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should never be reached, but just in case
  return null;
}
