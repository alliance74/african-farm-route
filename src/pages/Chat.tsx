import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatList } from '@/components/Chat/ChatList';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { ChatRoom } from '@/types/chat';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock user data - replace with actual auth context
const mockUser = {
  id: 'user-123',
  token: 'mock-jwt-token',
  user_type: 'farmer'
};

const Chat = () => {
  const user = useCurrentUser();
  const location = useLocation();
  const { toast } = useToast();
  if (!user) {
    return <div>Access denied</div>;
  }
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [bookingDraft, setBookingDraft] = useState(null);

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
    token: localStorage.getItem('token'),
    userId: user.id
  });

  // Auto-open chat if navigated from BookTransport
  useEffect(() => {
    if (
      connected &&
      !selectedRoom &&
      location.state && location.state.otherUserId
    ) {
      const { otherUserId, bookingDraft } = location.state;
      if (bookingDraft) setBookingDraft(bookingDraft);
      (async () => {
        const room = await createOrGetRoom(otherUserId);
        if (room) {
          // Ensure the room is in the rooms list
          if (!rooms.find(r => r.id === room.id)) {
            rooms.unshift(room);
          }
          setSelectedRoom(room);
          joinRoom(room);
        }
      })();
    }
  }, [connected, selectedRoom, location.state, createOrGetRoom, joinRoom, rooms]);

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

  const handleDeleteRoom = async (room: ChatRoom) => {
    if (!window.confirm('Are you sure you want to delete this chat? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/v1/chat/rooms/${room.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete chat room');
      toast({ title: 'Chat deleted', description: 'The chat has been deleted.' });
      if (selectedRoom?.id === room.id) {
        setSelectedRoom(null);
      }
      fetchRooms();
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
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
              currentUserId={user.id}
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom?.id}
              onDeleteRoom={handleDeleteRoom}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedRoom ? (
              <div>
                <ChatWindow
                  room={selectedRoom}
                  messages={messages}
                  currentUserId={user.id}
                  onSendMessage={handleSendMessage}
                  onClose={handleCloseChat}
                  isTyping={isTyping}
                  typingUser={typingUser}
                />
                {/* Show Confirm Booking if bookingDraft is present and user is farmer */}
                {bookingDraft && user.user_type === 'farmer' && (
                  <div className="mt-4 text-center">
                    <Button className="btn-hero" onClick={async () => {
                      try {
                        const res = await fetch('/api/v1/bookings', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify(bookingDraft)
                        });
                        if (!res.ok) throw new Error('Failed to create booking');
                        alert('Booking Confirmed!');
                      } catch (e) {
                        alert('Error: ' + e.message);
                      }
                    }}>
                      Confirm Booking
                    </Button>
                  </div>
                )}
              </div>
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