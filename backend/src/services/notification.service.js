const { logger } = require('../utils/logger');

class NotificationService {
  constructor() {
    this.notifications = new Map(); // In production, use Redis or database
  }

  // Send SMS notification
  async sendSMS(phoneNumber, message) {
    try {
      // In production, integrate with SMS service like Twilio, MSG91, etc.
      logger.info(`SMS sent to ${phoneNumber}: ${message}`);

      // Simulate SMS sending
      const smsId = `SMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        smsId,
        phoneNumber,
        message,
        sentAt: new Date(),
        status: 'sent'
      };
    } catch (error) {
      logger.error('Send SMS error:', error.message);
      throw new Error('Failed to send SMS');
    }
  }

  // Send email notification
  async sendEmail(email, subject, message, html = null) {
    try {
      // In production, integrate with email service like SendGrid, SES, etc.
      logger.info(`Email sent to ${email}: ${subject}`);

      // Simulate email sending
      const emailId = `EMAIL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        emailId,
        email,
        subject,
        message,
        html,
        sentAt: new Date(),
        status: 'sent'
      };
    } catch (error) {
      logger.error('Send email error:', error.message);
      throw new Error('Failed to send email');
    }
  }

  // Send push notification
  async sendPushNotification(userId, title, message, data = {}) {
    try {
      // In production, integrate with FCM, APNS, etc.
      logger.info(`Push notification sent to user ${userId}: ${title}`);

      const notificationId = `PUSH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        notificationId,
        userId,
        title,
        message,
        data,
        sentAt: new Date(),
        status: 'sent'
      };
    } catch (error) {
      logger.error('Send push notification error:', error.message);
      throw new Error('Failed to send push notification');
    }
  }

  // Send weather alert
  async sendWeatherAlert(userId, alertData) {
    try {
      const { type, severity, title, description } = alertData;

      const message = `Weather Alert: ${title}\n${description}\nSeverity: ${severity}`;

      // Send multiple notifications
      const notifications = await Promise.allSettled([
        this.sendSMS(userId.phone, message),
        this.sendEmail(userId.email, `Weather Alert - ${title}`, message),
        this.sendPushNotification(userId, title, description, { type: 'weather_alert', severity })
      ]);

      return {
        success: true,
        alertId: `ALERT_${Date.now()}`,
        userId,
        alertData,
        notificationsSent: notifications.filter(n => n.status === 'fulfilled').length,
        sentAt: new Date()
      };
    } catch (error) {
      logger.error('Send weather alert error:', error.message);
      throw new Error('Failed to send weather alert');
    }
  }

  // Send order notification
  async sendOrderNotification(orderId, type, userData) {
    try {
      let subject, message;

      switch (type) {
        case 'order_placed':
          subject = 'Order Placed Successfully';
          message = `Your order ${orderId} has been placed successfully. We'll notify you when it's shipped.`;
          break;
        case 'order_shipped':
          subject = 'Order Shipped';
          message = `Your order ${orderId} has been shipped. Track your order for updates.`;
          break;
        case 'order_delivered':
          subject = 'Order Delivered';
          message = `Your order ${orderId} has been delivered. Please rate your experience.`;
          break;
        case 'order_cancelled':
          subject = 'Order Cancelled';
          message = `Your order ${orderId} has been cancelled. Refund will be processed within 3-5 business days.`;
          break;
        default:
          subject = 'Order Update';
          message = `Update for your order ${orderId}`;
      }

      const notifications = await Promise.allSettled([
        this.sendEmail(userData.email, subject, message),
        this.sendPushNotification(userData.id, subject, message, { type: 'order_update', orderId })
      ]);

      return {
        success: true,
        orderId,
        notificationType: type,
        notificationsSent: notifications.filter(n => n.status === 'fulfilled').length
      };
    } catch (error) {
      logger.error('Send order notification error:', error.message);
      throw new Error('Failed to send order notification');
    }
  }

  // Send scheme notification
  async sendSchemeNotification(userId, schemeData) {
    try {
      const subject = `New Scheme Available: ${schemeData.name}`;
      const message = `
        A new government scheme is available for you!
        Scheme: ${schemeData.name}
        Description: ${schemeData.description}
        Eligibility: ${schemeData.eligibility}
        Benefits: ${schemeData.benefits}
        Apply before: ${schemeData.deadline}
      `;

      const notifications = await Promise.allSettled([
        this.sendSMS(userId.phone, `New scheme: ${schemeData.name}. Check your email for details.`),
        this.sendEmail(userId.email, subject, message),
        this.sendPushNotification(userId, subject, schemeData.description, {
          type: 'scheme_notification',
          schemeId: schemeData.id
        })
      ]);

      return {
        success: true,
        userId,
        schemeId: schemeData.id,
        notificationsSent: notifications.filter(n => n.status === 'fulfilled').length
      };
    } catch (error) {
      logger.error('Send scheme notification error:', error.message);
      throw new Error('Failed to send scheme notification');
    }
  }

  // Send market price alert
  async sendMarketPriceAlert(userId, cropData) {
    try {
      const subject = `Price Alert: ${cropData.name}`;
      const message = `
        Market price update for ${cropData.name}:
        Current Price: ₹${cropData.currentPrice}/kg
        Change: ${cropData.change > 0 ? '+' : ''}${cropData.change} (${cropData.changePercent}%)
        Recommended Action: ${cropData.recommendation}
      `;

      const notifications = await Promise.allSettled([
        this.sendSMS(userId.phone, `Price alert: ${cropData.name} at ₹${cropData.currentPrice}/kg`),
        this.sendPushNotification(userId, subject, message, {
          type: 'price_alert',
          cropId: cropData.id
        })
      ]);

      return {
        success: true,
        userId,
        cropId: cropData.id,
        notificationsSent: notifications.filter(n => n.status === 'fulfilled').length
      };
    } catch (error) {
      logger.error('Send market price alert error:', error.message);
      throw new Error('Failed to send market price alert');
    }
  }

  // Bulk notification for all users
  async sendBulkNotification(userIds, title, message, type = 'general') {
    try {
      const results = [];

      for (const userId of userIds) {
        try {
          const result = await this.sendPushNotification(userId, title, message, { type });
          results.push(result);
        } catch (error) {
          logger.error(`Failed to send notification to user ${userId}:`, error.message);
        }
      }

      return {
        success: true,
        totalUsers: userIds.length,
        successfulNotifications: results.length,
        failedNotifications: userIds.length - results.length
      };
    } catch (error) {
      logger.error('Send bulk notification error:', error.message);
      throw new Error('Failed to send bulk notifications');
    }
  }

  // Get notification history for user
  async getNotificationHistory(userId, page = 1, limit = 20) {
    try {
      // In production, fetch from database
      // For now, return mock data
      return {
        userId,
        notifications: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      logger.error('Get notification history error:', error.message);
      throw new Error('Failed to get notification history');
    }
  }
}

module.exports = new NotificationService();