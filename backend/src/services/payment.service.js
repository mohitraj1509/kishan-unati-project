const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logger } = require('../utils/logger');

class PaymentService {
  async createPaymentIntent(amount, currency = 'inr') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to paisa
        currency,
        payment_method_types: ['card'],
        metadata: {
          integration_check: 'accept_a_payment'
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      logger.error('Create payment intent error:', error.message);
      throw new Error('Failed to create payment intent');
    }
  }

  async processPayment({ amount, paymentMethod, userId }) {
    try {
      // For demo purposes, simulate payment processing
      // In production, integrate with actual payment gateway

      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate payment success/failure
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        return {
          success: true,
          paymentId,
          status: 'completed',
          amount,
          currency: 'INR',
          processedAt: new Date()
        };
      } else {
        return {
          success: false,
          paymentId,
          status: 'failed',
          error: 'Payment processing failed'
        };
      }
    } catch (error) {
      logger.error('Process payment error:', error.message);
      throw new Error('Payment processing failed');
    }
  }

  async refundPayment(paymentId, amount, reason) {
    try {
      // Simulate refund processing
      const refundId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        refundId,
        paymentId,
        amount,
        reason,
        status: 'completed',
        processedAt: new Date()
      };
    } catch (error) {
      logger.error('Refund payment error:', error.message);
      throw new Error('Refund processing failed');
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      // Simulate payment status check
      const statuses = ['pending', 'completed', 'failed', 'refunded'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        paymentId,
        status: randomStatus,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Get payment status error:', error.message);
      throw new Error('Failed to get payment status');
    }
  }

  // UPI Payment methods (for Indian market)
  async createUPIPayment(amount, upiId, description) {
    try {
      // In a real implementation, integrate with UPI payment gateway
      const paymentData = {
        amount,
        upiId,
        description,
        paymentId: `UPI_${Date.now()}`,
        status: 'pending',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

      return paymentData;
    } catch (error) {
      logger.error('Create UPI payment error:', error.message);
      throw new Error('Failed to create UPI payment');
    }
  }

  // Wallet payment methods
  async processWalletPayment(walletId, amount, pin) {
    try {
      // Simulate wallet payment
      const success = Math.random() > 0.05; // 95% success rate

      if (success) {
        return {
          success: true,
          transactionId: `WAL_${Date.now()}`,
          walletId,
          amount,
          status: 'completed'
        };
      } else {
        return {
          success: false,
          error: 'Insufficient wallet balance or invalid PIN'
        };
      }
    } catch (error) {
      logger.error('Wallet payment error:', error.message);
      throw new Error('Wallet payment failed');
    }
  }

  // Cash on Delivery
  async processCOD(orderId, amount) {
    try {
      return {
        success: true,
        orderId,
        amount,
        paymentMethod: 'cod',
        status: 'pending_delivery',
        instructions: 'Payment will be collected upon delivery'
      };
    } catch (error) {
      logger.error('COD processing error:', error.message);
      throw new Error('COD processing failed');
    }
  }

  // Get payment methods available for user
  async getAvailablePaymentMethods(userId) {
    try {
      // In a real implementation, check user's saved payment methods
      return {
        card: true,
        upi: true,
        wallet: true,
        netBanking: true,
        cod: true
      };
    } catch (error) {
      logger.error('Get payment methods error:', error.message);
      throw new Error('Failed to get payment methods');
    }
  }

  // Validate payment amount
  validateAmount(amount) {
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    if (amount > 1000000) { // 10 lakh limit
      throw new Error('Payment amount exceeds maximum limit');
    }
    return true;
  }
}

module.exports = new PaymentService();