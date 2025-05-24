const PaymentRepository = require('../repository/PaymentRepository');
const { razorpay, RAZORPAY_CONSTANTS } = require('../config/razorpay');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  /**
   * Create a Razorpay order for rent payment
   * @param {Object} orderData - Order creation data
   * @returns {Promise<Object>} Created order and payment record
   */
  async createRentPaymentOrder(orderData) {
    try {
      const { tenantId, propertyId, roomId, amount, description } = orderData;

      // Generate unique receipt ID
      const receiptId = `${RAZORPAY_CONSTANTS.RECEIPT_PREFIX}${Date.now()}_${uuidv4().substring(0, 8)}`;

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: RAZORPAY_CONSTANTS.CURRENCY,
        receipt: receiptId,
        payment_capture: RAZORPAY_CONSTANTS.PAYMENT_CAPTURE,
        notes: {
          tenantId: tenantId.toString(),
          propertyId: propertyId.toString(),
          roomId: roomId.toString(),
          description: description || 'Rent Payment'
        }
      });

      // Create payment record in database
      const paymentData = {
        tenantId,
        propertyId,
        roomId,
        amount,
        currency: RAZORPAY_CONSTANTS.CURRENCY,
        razorpayOrderId: razorpayOrder.id,
        status: 'Pending',
        paymentMethod: null
      };

      const payment = await this.paymentRepository.createPayment(paymentData);

      return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        payment,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      };
    } catch (error) {
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  /**
   * Verify payment signature and update payment status
   * @param {Object} paymentData - Payment verification data
   * @returns {Promise<Object>} Updated payment record
   */
  async verifyAndCapturePayment(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

      // Verify payment signature
      const isValidSignature = this.verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      if (!isValidSignature) {
        throw new Error('Invalid payment signature');
      }

      // Find payment record
      const payment = await this.paymentRepository.findByRazorpayOrderId(razorpay_order_id);
      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Fetch payment details from Razorpay
      const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

      // Update payment record
      const updateData = {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: razorpayPayment.status === 'captured' ? 'Captured' : 'Authorized',
        paymentMethod: this.mapPaymentMethod(razorpayPayment.method)
      };

      const updatedPayment = await this.paymentRepository.updatePayment(payment.id, updateData);

      return {
        success: true,
        payment: updatedPayment,
        razorpayPayment
      };
    } catch (error) {
      // Update payment status to failed if payment record exists
      try {
        const payment = await this.paymentRepository.findByRazorpayOrderId(paymentData.razorpay_order_id);
        if (payment) {
          await this.paymentRepository.updatePayment(payment.id, { status: 'Failed' });
        }
      } catch (updateError) {
        console.error('Failed to update payment status to failed:', updateError);
      }

      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Handle Razorpay webhook events
   * @param {Object} webhookData - Webhook payload
   * @param {string} signature - Webhook signature
   * @returns {Promise<Object>} Processing result
   */
  async handleWebhook(webhookData, signature) {
    try {
      // Verify webhook signature
      const isValidWebhook = this.verifyWebhookSignature(webhookData, signature);
      if (!isValidWebhook) {
        throw new Error('Invalid webhook signature');
      }

      const { event, payload } = webhookData;

      switch (event) {
        case RAZORPAY_CONSTANTS.WEBHOOK_EVENTS.PAYMENT_AUTHORIZED:
          return await this.handlePaymentAuthorized(payload.payment.entity);

        case RAZORPAY_CONSTANTS.WEBHOOK_EVENTS.PAYMENT_CAPTURED:
          return await this.handlePaymentCaptured(payload.payment.entity);

        case RAZORPAY_CONSTANTS.WEBHOOK_EVENTS.PAYMENT_FAILED:
          return await this.handlePaymentFailed(payload.payment.entity);

        case RAZORPAY_CONSTANTS.WEBHOOK_EVENTS.ORDER_PAID:
          return await this.handleOrderPaid(payload.order.entity);

        default:
          console.log(`Unhandled webhook event: ${event}`);
          return { success: true, message: 'Event not handled' };
      }
    } catch (error) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  /**
   * Get payment details by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentById(paymentId) {
    try {
      const payment = await this.paymentRepository.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }
      return payment;
    } catch (error) {
      throw new Error(`Failed to get payment: ${error.message}`);
    }
  }

  /**
   * Get payments by tenant with pagination
   * @param {number} tenantId - Tenant ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated payments
   */
  async getPaymentsByTenant(tenantId, options) {
    try {
      return await this.paymentRepository.getPaymentsByTenant(tenantId, options);
    } catch (error) {
      throw new Error(`Failed to get tenant payments: ${error.message}`);
    }
  }

  /**
   * Get payments by property with pagination
   * @param {number} propertyId - Property ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated payments
   */
  async getPaymentsByProperty(propertyId, options) {
    try {
      return await this.paymentRepository.getPaymentsByProperty(propertyId, options);
    } catch (error) {
      throw new Error(`Failed to get property payments: ${error.message}`);
    }
  }

  /**
   * Get all payments with filters and pagination
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Paginated payments
   */
  async getAllPayments(options) {
    try {
      return await this.paymentRepository.getAllPayments(options);
    } catch (error) {
      throw new Error(`Failed to get all payments: ${error.message}`);
    }
  }

  /**
   * Initiate refund for a payment
   * @param {Object} refundData - Refund data
   * @returns {Promise<Object>} Refund details
   */
  async initiateRefund(refundData) {
    try {
      const { paymentId, amount, reason } = refundData;

      // Get payment record
      const payment = await this.paymentRepository.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'Captured') {
        throw new Error('Only captured payments can be refunded');
      }

      // Create refund in Razorpay
      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        notes: {
          reason: reason || 'Refund requested',
          paymentId: paymentId.toString()
        }
      });

      // Update payment status
      await this.paymentRepository.updatePayment(paymentId, {
        status: amount && amount < payment.amount ? 'Partially Refunded' : 'Refunded'
      });

      return {
        success: true,
        refund,
        payment
      };
    } catch (error) {
      throw new Error(`Failed to initiate refund: ${error.message}`);
    }
  }

  // Private helper methods

  /**
   * Verify Razorpay payment signature
   * @param {Object} data - Payment data
   * @returns {boolean} Signature validity
   */
  verifyPaymentSignature(data) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    return expectedSignature === razorpay_signature;
  }

  /**
   * Verify Razorpay webhook signature
   * @param {Object} body - Webhook body
   * @param {string} signature - Webhook signature
   * @returns {boolean} Signature validity
   */
  verifyWebhookSignature(body, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_CONSTANTS.WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');
    return expectedSignature === signature;
  }

  /**
   * Map Razorpay payment method to internal enum
   * @param {string} razorpayMethod - Razorpay payment method
   * @returns {string} Internal payment method
   */
  mapPaymentMethod(razorpayMethod) {
    const methodMap = {
      'upi': 'UPI',
      'card': 'UPI', // Map card to UPI for simplicity
      'netbanking': 'UPI',
      'wallet': 'UPI',
      'emi': 'UPI'
    };
    return methodMap[razorpayMethod] || 'UPI';
  }

  // Webhook event handlers

  async handlePaymentAuthorized(paymentEntity) {
    const payment = await this.paymentRepository.findByRazorpayPaymentId(paymentEntity.id);
    if (payment) {
      await this.paymentRepository.updatePayment(payment.id, { status: 'Authorized' });
    }
    return { success: true, message: 'Payment authorized' };
  }

  async handlePaymentCaptured(paymentEntity) {
    const payment = await this.paymentRepository.findByRazorpayPaymentId(paymentEntity.id);
    if (payment) {
      await this.paymentRepository.updatePayment(payment.id, { status: 'Captured' });
    }
    return { success: true, message: 'Payment captured' };
  }

  async handlePaymentFailed(paymentEntity) {
    const payment = await this.paymentRepository.findByRazorpayOrderId(paymentEntity.order_id);
    if (payment) {
      await this.paymentRepository.updatePayment(payment.id, { status: 'Failed' });
    }
    return { success: true, message: 'Payment failed' };
  }

  async handleOrderPaid(orderEntity) {
    const payment = await this.paymentRepository.findByRazorpayOrderId(orderEntity.id);
    if (payment) {
      await this.paymentRepository.updatePayment(payment.id, { status: 'Captured' });
    }
    return { success: true, message: 'Order paid' };
  }
}

module.exports = new PaymentService();
