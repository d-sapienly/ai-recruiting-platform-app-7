import React, { useState } from 'react';
import { Search, Send, MessageSquare } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    lastSeen?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface MessagesTabProps {
  conversations: Conversation[];
  messages: Message[];
  currentUserId: string;
}

const MessagesTab: React.FC<MessagesTabProps> = ({
  conversations = [],
  messages = [],
  currentUserId
}) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    // Here you would typically call an API to send the message
    console.log('Sending message:', messageText, 'to conversation:', selectedConversation);
    
    // Clear the input
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white rounded-lg shadow overflow-hidden">
      {/* Conversations sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-start ${
                  selectedConversation === conversation.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="relative flex-shrink-0">
                  {conversation.participant.avatar ? (
                    <img
                      src={conversation.participant.avatar}
                      alt={conversation.participant.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {conversation.participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {conversation.participant.status === 'online' && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participant.name}
                    </p>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-500">
                        {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    {conversation.lastMessage ? (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No messages yet</p>
                    )}
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              {(() => {
                const conversation = conversations.find(c => c.id === selectedConversation);
                if (!conversation) return null;
                
                return (
                  <>
                    {conversation.participant.avatar ? (
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {conversation.participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {conversation.participant.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversation.participant.status === 'online' 
                          ? 'Online' 
                          : conversation.participant.lastSeen 
                            ? `Last seen ${new Date(conversation.participant.lastSeen).toLocaleString()}` 
                            : 'Offline'}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isCurrentUser = message.sender.id === currentUserId;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          isCurrentUser 
                            ? 'bg-indigo-600 text-white rounded-l-lg rounded-br-lg' 
                            : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg'
                        } px-4 py-2 shadow`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Message input */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  className="ml-3" 
                  onClick={handleSendMessage}
                  disabled={messageText.trim() === ''}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
              <p className="text-gray-500 mt-1">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
