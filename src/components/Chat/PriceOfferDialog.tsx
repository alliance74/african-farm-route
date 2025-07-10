import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PriceOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number, currency: string, message?: string) => void;
}

export const PriceOfferDialog: React.FC<PriceOfferDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('KSh');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    onSubmit(numAmount, currency, message.trim() || undefined);
    
    // Reset form
    setAmount('');
    setMessage('');
  };

  const handleClose = () => {
    setAmount('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-success" />
            Send Price Offer
          </DialogTitle>
          <DialogDescription>
            Send a price offer for this transport service. The other party can accept, decline, or counter-offer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KSh">KSh</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="RWF">RWF</SelectItem>
                  <SelectItem value="UGX">UGX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add any additional details about your offer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {amount && !isNaN(parseFloat(amount)) && (
            <div className="p-3 bg-accent rounded-lg">
              <div className="text-sm text-muted-foreground">Your offer:</div>
              <div className="text-lg font-bold text-success">
                {currency} {parseFloat(amount).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
            className="bg-success hover:bg-success/90"
          >
            Send Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};