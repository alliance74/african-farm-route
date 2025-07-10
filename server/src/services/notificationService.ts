import nodemailer from 'nodemailer';
import { config } from '../config/config';

export class NotificationService {
  private static emailTransporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  static async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!config.email.user || !config.email.pass) {
      console.log('Email service not configured, skipping email send');
      return;
    }

    try {
      await this.emailTransporter.sendMail({
        from: `"AgriMove" <${config.email.user}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  static async sendSMS(to: string, message: string): Promise<void> {
    if (!config.twilio.accountSid || !config.twilio.authToken) {
      console.log('SMS service not configured, skipping SMS send');
      return;
    }

    try {
      // Twilio SMS implementation would go here
      console.log(`SMS to ${to}: ${message}`);
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }

  static async notifyBookingCreated(booking: any): Promise<void> {
    // Notify available drivers about new booking
    const message = `New booking available: ${booking.goods_type} from ${booking.pickup_location} to ${booking.delivery_location}`;
    
    // In a real implementation, you would:
    // 1. Get all available drivers in the service area
    // 2. Send push notifications or SMS to them
    console.log('Booking created notification:', message);
  }

  static async notifyBookingConfirmed(booking: any): Promise<void> {
    // Notify farmer that booking is confirmed
    if (booking.farmer?.email) {
      const html = `
        <h2>Booking Confirmed</h2>
        <p>Your transport booking has been confirmed!</p>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Driver:</strong> ${booking.driver?.full_name}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle?.make} ${booking.vehicle?.model}</p>
        <p><strong>Pickup:</strong> ${booking.pickup_location}</p>
        <p><strong>Delivery:</strong> ${booking.delivery_location}</p>
        <p><strong>Scheduled:</strong> ${booking.scheduled_date} at ${booking.scheduled_time}</p>
      `;
      
      await this.sendEmail(
        booking.farmer.email,
        'Booking Confirmed - AgriMove',
        html
      );
    }

    // Send SMS to farmer
    if (booking.farmer?.phone) {
      const message = `AgriMove: Your booking ${booking.id} has been confirmed. Driver: ${booking.driver?.full_name}. Contact: ${booking.driver?.phone}`;
      await this.sendSMS(booking.farmer.phone, message);
    }
  }

  static async notifyBookingStatusUpdate(booking: any): Promise<void> {
    const statusMessages = {
      in_transit: 'Your goods are now in transit',
      delivered: 'Your goods have been delivered successfully',
      cancelled: 'Your booking has been cancelled'
    };

    const message = statusMessages[booking.status as keyof typeof statusMessages];
    
    if (message && booking.farmer?.phone) {
      await this.sendSMS(
        booking.farmer.phone,
        `AgriMove: ${message}. Booking ID: ${booking.id}`
      );
    }
  }
}