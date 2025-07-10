import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatRoom } from '@/types/chat';

interface ChatListProps {
  rooms: ChatRoom[];
  currentUserId: string;
  onRoomSelect: (room: ChatRoom) => void;
  selectedRoomId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  rooms,
  currentUserId,
  onRoomSelect,
  selectedRoomId
}) => {
  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherUser = (room: ChatRoom) => {
    return room.farmer?.id === currentUserId ? room.driver : room.farmer;
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (rooms.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-8">
          <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Chats Yet</h3>
          <p className="text-muted-foreground text-center">
            Start a conversation with a farmer or driver to discuss transport details and pricing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {rooms.map((room) => {
            const otherUser = getOtherUser(room);
            const isSelected = selectedRoomId === room.id;
            
            return (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                  isSelected ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={otherUser?.profile_image} />
                      <AvatarFallback>
                        {otherUser?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {room.unread_count && room.unread_count > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {room.unread_count > 9 ? '9+' : room.unread_count}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {otherUser?.full_name || 'Unknown User'}
                      </h4>
                      {room.last_message && (
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatLastMessageTime(room.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    {room.booking && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {room.booking.goods_type} • {room.booking.pickup_location}
                      </p>
                    )}
                    
                    {room.last_message ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {room.last_message.message_type === 'price_offer' && (
                          <span className="text-success font-medium">💰 </span>
                        )}
                        {truncateMessage(room.last_message.content)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};