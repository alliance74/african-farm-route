import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MoreVertical, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatRoom } from '@/types/chat';
import { PriceOfferDialog } from './PriceOfferDialog';

interface ChatWindowProps {
  room: ChatRoom;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string, type?: string, metadata?: any) => void;
  onClose: () => void;
  isTyping?: boolean;
  typingUser?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  room,
  messages,
  currentUserId,
  onSendMessage,
  onClose,
  isTyping,
  typingUser
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showPriceOffer, setShowPriceOffer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const otherUser = room.farmer?.id === currentUserId ? room.driver : room.farmer;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePriceOffer = (amount: number, currency: string, message?: string) => {
    onSendMessage(
      `Price offer: ${currency} ${amount}${message ? ` - ${message}` : ''}`,
      'price_offer',
      { price: amount, currency, message }
    );
    setShowPriceOffer(false);
    toast({
      title: "Price offer sent",
      description: "Your price offer has been sent successfully"
    });
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwn = message.sender_id === currentUserId;
    const isSystem = message.message_type === 'system';
    const isPriceOffer = message.message_type === 'price_offer';

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <Badge variant="secondary" className="text-xs">
            {message.content}
          </Badge>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
          {!isOwn && (
            <div className="flex items-center mb-1">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={message.sender?.profile_image} />
                <AvatarFallback>
                  {message.sender?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {message.sender?.full_name}
              </span>
            </div>
          )}
          
          <div className={`rounded-lg p-3 ${
            isOwn 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          } ${isPriceOffer ? 'border-2 border-success' : ''}`}>
            {isPriceOffer && (
              <div className="flex items-center mb-2">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="font-semibold text-sm">Price Offer</span>
              </div>
            )}
            
            <p className="text-sm">{message.content}</p>
            
            {isPriceOffer && message.metadata?.price && (
              <div className="mt-2 p-2 bg-background/10 rounded">
                <div className="text-lg font-bold">
                  {message.metadata.currency} {message.metadata.price}
                </div>
                {message.metadata.message && (
                  <div className="text-xs opacity-80">
                    {message.metadata.message}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={`text-xs text-muted-foreground mt-1 ${
            isOwn ? 'text-right' : 'text-left'
          }`}>
            {formatMessageTime(message.created_at)}
            {message.is_read && isOwn && (
              <span className="ml-1">✓</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-md">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={otherUser?.profile_image} />
              <AvatarFallback>
                {otherUser?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{otherUser?.full_name}</CardTitle>
              {room.booking && (
                <p className="text-sm text-muted-foreground">
                  {room.booking.pickup_location} → {room.booking.delivery_location}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          {messages.map(renderMessage)}
          
          {isTyping && typingUser && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {typingUser} is typing...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Input */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPriceOffer(true)}
            className="flex items-center"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Price Offer
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Offer Dialog */}
      <PriceOfferDialog
        open={showPriceOffer}
        onClose={() => setShowPriceOffer(false)}
        onSubmit={handlePriceOffer}
      />
    </Card>
  );
};