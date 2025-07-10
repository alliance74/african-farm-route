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
import { useCurrentUser } from '@/hooks/useCurrentUser';

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
  const { toast } = useToast();
  const user = useCurrentUser();

  const otherUser = room.farmer?.id === currentUserId ? room.driver : room.farmer;

  // Helper: check if booking is confirmed or pending confirmation
  const bookingStatus = room.booking?.status;
  const bookingId = room.booking?.id;
  const canConfirmBooking = bookingId && (bookingStatus === 'pending' || bookingStatus === 'pending_confirmation');

  // Track if a confirmation request is pending
  const [confirmationPending, setConfirmationPending] = useState(false);

  // Watch messages to determine if a confirmation is pending or resolved
  useEffect(() => {
    // Find the latest confirmation request sent by this user
    const lastRequest = [...messages].reverse().find(
      m => m.message_type === 'text' && m.content === '[Booking Confirmation Requested]' && m.sender_id === currentUserId
    );
    if (lastRequest) {
      // Look for a response to this request
      const response = messages.find(
        m => m.metadata?.request_message_id === lastRequest.id &&
          m.message_type === 'text' &&
          (m.content === '[Booking Confirmed]' || m.content === '[Booking Declined]')
      );
      setConfirmationPending(!response);
    } else {
      setConfirmationPending(false);
    }
  }, [messages, currentUserId]);

  // Handler for sending booking confirmation request
  const handleRequestBookingConfirmation = () => {
    if (!bookingId) return;
    onSendMessage(
      '[Booking Confirmation Requested]',
      'text',
      { booking_id: bookingId }
    );
    toast({ title: 'Confirmation Requested', description: 'The other user will be asked to confirm this booking.' });
    setConfirmationPending(true);
  };

  // Handler for responding to booking confirmation
  const handleRespondBookingConfirmation = (message: ChatMessage, accepted: boolean) => {
    if (!bookingId) return;
    if (accepted) {
      onSendMessage(
        '[Booking Confirmed]',
        'text',
        { booking_id: bookingId, request_message_id: message.id }
      );
      // Optionally: call API to update booking status to confirmed
    } else {
      onSendMessage(
        '[Booking Declined]',
        'text',
        { booking_id: bookingId, request_message_id: message.id }
      );
    }
  };

  // --- UI Improvements ---
  // 1. Chat card fills more of the screen
  // 2. Chat area has a soft background
  // 3. Input area is sticky at the bottom
  // 4. Subtle hover on messages
  // 5. Improved spacing and font sizes

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
    // Special: booking confirmation request (now as text)
    if (message.message_type === 'text' && message.content === '[Booking Confirmation Requested]') {
      const isRecipient = message.sender_id !== currentUserId;
      return (
        <div key={message.id} className="flex justify-center my-4">
          <Badge variant="secondary" className="text-xs">
            {isOwn ? 'You requested booking confirmation' : `${message.sender?.full_name} requested booking confirmation`}
          </Badge>
          {isRecipient && (
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="default" onClick={() => handleRespondBookingConfirmation(message, true)}>
                Confirm
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleRespondBookingConfirmation(message, false)}>
                Decline
              </Button>
            </div>
          )}
        </div>
      );
    }
    if (message.message_type === 'text' && message.content === '[Booking Confirmed]') {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <Badge variant="default" className="text-xs">Booking Confirmed</Badge>
        </div>
      );
    }
    if (message.message_type === 'text' && message.content === '[Booking Declined]') {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <Badge variant="destructive" className="text-xs">Booking Declined</Badge>
        </div>
      );
    }

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

  // Find the latest confirmation request in the chat
  const lastRequest = [...messages].reverse().find(
    m => m.message_type === 'text' && m.content === '[Booking Confirmation Requested]'
  );
  const lastRequestIsOwn = lastRequest && lastRequest.sender_id === currentUserId;
  const lastRequestIsOther = lastRequest && lastRequest.sender_id !== currentUserId;
  const lastRequestResponse = lastRequest && messages.find(
    m => m.metadata?.request_message_id === lastRequest.id &&
      m.message_type === 'text' &&
      (m.content === '[Booking Confirmed]' || m.content === '[Booking Declined]')
  );

  return (
    <Card className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto shadow-lg border border-muted bg-background/80 backdrop-blur-md">
      {/* Header */}
      <CardHeader className="pb-3 bg-background/90 sticky top-0 z-10 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={otherUser?.profile_image} />
              <AvatarFallback>
                {otherUser?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{otherUser?.full_name}</CardTitle>
              {room.booking && (
                <p className="text-sm text-muted-foreground">
                  {room.booking.pickup_location} → {room.booking.delivery_location}
                </p>
              )}
              {/* Confirm Booking Button or Respond UI */}
              {canConfirmBooking && !lastRequest && (
                <Button size="sm" className="mt-2" onClick={handleRequestBookingConfirmation}>
                  Confirm Booking
                </Button>
              )}
              {canConfirmBooking && lastRequestIsOwn && !lastRequestResponse && (
                <Button size="sm" className="mt-2" disabled>
                  Waiting for response...
                </Button>
              )}
              {canConfirmBooking && lastRequestIsOther && !lastRequestResponse && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="default" onClick={() => handleRespondBookingConfirmation(lastRequest, true)}>
                    Confirm
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleRespondBookingConfirmation(lastRequest, false)}>
                    Decline
                  </Button>
                </div>
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
      <CardContent className="flex-1 p-0 bg-gradient-to-b from-background/80 to-muted/60 relative overflow-y-auto">
        <div className="h-full flex flex-col gap-2 p-4 pb-32">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`group transition-all ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'} flex`}
            >
              <div
                className={`max-w-[70%] ${message.sender_id === currentUserId ? 'order-2' : 'order-1'} rounded-lg p-3 shadow-sm transition-all
                  ${message.sender_id === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-white/80 text-foreground'}
                  ${message.message_type === 'price_offer' ? 'border-2 border-success' : ''}
                  hover:scale-[1.02] hover:shadow-md
                `}
              >
                {/* Avatar and name for other user */}
                {message.sender_id !== currentUserId && (
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
                {/* Price offer badge */}
                {message.message_type === 'price_offer' && (
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-semibold text-sm">Price Offer</span>
                  </div>
                )}
                {/* Message content */}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                {/* Price offer details */}
                {message.message_type === 'price_offer' && message.metadata?.price && (
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
                {/* Timestamp and read receipt */}
                <div className={`text-xs text-muted-foreground mt-1 ${message.sender_id === currentUserId ? 'text-right' : 'text-left'}`}>
                  {formatMessageTime(message.created_at)}
                  {message.is_read && message.sender_id === currentUserId && (
                    <span className="ml-1">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
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
        </div>
      </CardContent>
      <Separator />
      {/* Input - sticky at bottom */}
      <div className="p-4 bg-background/95 sticky bottom-0 z-20 border-t border-muted shadow-inner">
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