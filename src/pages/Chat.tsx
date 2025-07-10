import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatList } from '@/components/Chat/ChatList';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { ChatRoom } from '@/types/chat';

// Mock user data - replace with actual auth context
const mockUser = {
  id: 'user-123',
  token: 'mock-jwt-token',
  user_type: 'farmer'
};

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  const {
    connected,
    rooms,
    currentRoom,
    messages,
    isTyping,
    typingUser,
    fetchRooms,
    createOrGetRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping
  } = useChat({
    token: mockUser.token,
    userId: mockUser.id
  });

  useEffect(() => {
    if (connected) {
      fetchRooms();
    }
  }, [connected, fetchRooms]);

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
    joinRoom(room);
  };

  const handleSendMessage = (content: string, type?: string, metadata?: any) => {
    sendMessage(content, type, metadata);
  };

  const handleCloseChat = () => {
    leaveRoom();
    setSelectedRoom(null);
  };

  const handleStartNewChat = async (otherUserId: string, bookingId?: string) => {
    const room = await createOrGetRoom(otherUserId, bookingId);
    if (room) {
      handleRoomSelect(room);
    }
    setShowNewChatDialog(false);
  };

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Messages</h1>
              <p className="text-xl text-muted-foreground">
                Chat with farmers and drivers to discuss transport details and pricing
              </p>
            </div>
            
            <Button 
              onClick={() => setShowNewChatDialog(true)}
              className="btn-hero"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Chat
            </Button>
          </div>
          
          {!connected && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Connecting to chat server...
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <ChatList
              rooms={rooms}
              currentUserId={mockUser.id}
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom?.id}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedRoom ? (
              <ChatWindow
                room={selectedRoom}
                messages={messages}
                currentUserId={mockUser.id}
                onSendMessage={handleSendMessage}
                onClose={handleCloseChat}
                isTyping={isTyping}
                typingUser={typingUser}
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a chat from the list to start messaging, or create a new conversation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;