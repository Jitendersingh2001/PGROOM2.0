const BasePrismaRepository = require('./BasePrismaRepository');
const { PrismaClient } = require('@prisma/client');

class PaymentRepository extends BasePrismaRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  /**
   * Create a new payment record
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment record
   */
  async createPayment(paymentData) {
    try {
      return await this.prisma.payment.create({
        data: paymentData,
        include: {
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobileNo: true
            }
          },
          property: {
            select: {
              id: true,
              propertyName: true,
              propertyAddress: true
            }
          },
          room: {
            select: {
              id: true,
              roomNo: true,
              rent: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  /**
   * Update payment by ID
   * @param {number} paymentId - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated payment record
   */
  async updatePayment(paymentId, updateData) {
    try {
      return await this.prisma.payment.update({
        where: { id: paymentId },
        data: updateData,
        include: {
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobileNo: true
            }
          },
          property: {
            select: {
              id: true,
              propertyName: true,
              propertyAddress: true
            }
          },
          room: {
            select: {
              id: true,
              roomNo: true,
              rent: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  /**
   * Find payment by Razorpay Order ID
   * @param {string} razorpayOrderId - Razorpay Order ID
   * @returns {Promise<Object|null>} Payment record or null
   */
  async findByRazorpayOrderId(razorpayOrderId) {
    try {
      return await this.prisma.payment.findUnique({
        where: { razorpayOrderId },
        include: {
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobileNo: true
            }
          },
          property: {
            select: {
              id: true,
              propertyName: true,
              propertyAddress: true
            }
          },
          room: {
            select: {
              id: true,
              roomNo: true,
              rent: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to find payment by Razorpay Order ID: ${error.message}`);
    }
  }

  /**
   * Find payment by Razorpay Payment ID
   * @param {string} razorpayPaymentId - Razorpay Payment ID
   * @returns {Promise<Object|null>} Payment record or null
   */
  async findByRazorpayPaymentId(razorpayPaymentId) {
    try {
      return await this.prisma.payment.findUnique({
        where: { razorpayPaymentId },
        include: {
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobileNo: true
            }
          },
          property: {
            select: {
              id: true,
              propertyName: true,
              propertyAddress: true
            }
          },
          room: {
            select: {
              id: true,
              roomNo: true,
              rent: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to find payment by Razorpay Payment ID: ${error.message}`);
    }
  }

  /**
   * Get payment by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise<Object|null>} Payment record or null
   */
  async getPaymentById(paymentId) {
    try {
      return await this.prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobileNo: true
            }
          },
          property: {
            select: {
              id: true,
              propertyName: true,
              propertyAddress: true
            }
          },
          room: {
            select: {
              id: true,
              roomNo: true,
              rent: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to get payment by ID: ${error.message}`);
    }
  }

  /**
   * Get payments by tenant ID with pagination
   * @param {number} tenantId - Tenant ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated payments
   */
  async getPaymentsByTenant(tenantId, options = {}) {
    try {
      const { page = 1, limit = 10, status } = options;
      const skip = (page - 1) * limit;

      const where = { tenantId };
      if (status) {
        where.status = status;
      }

      const [payments, total] = await Promise.all([
        this.prisma.payment.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobileNo: true
              }
            },
            property: {
              select: {
                id: true,
                propertyName: true,
                propertyAddress: true
              }
            },
            room: {
              select: {
                id: true,
                roomNo: true,
                rent: true
              }
            }
          }
        }),
        this.prisma.payment.count({ where })
      ]);

      return {
        data: payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get payments by tenant: ${error.message}`);
    }
  }

  /**
   * Get payments by property ID with pagination
   * @param {number} propertyId - Property ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated payments
   */
  async getPaymentsByProperty(propertyId, options = {}) {
    try {
      const { page = 1, limit = 10, status } = options;
      const skip = (page - 1) * limit;

      const where = { propertyId };
      if (status) {
        where.status = status;
      }

      const [payments, total] = await Promise.all([
        this.prisma.payment.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobileNo: true
              }
            },
            property: {
              select: {
                id: true,
                propertyName: true,
                propertyAddress: true
              }
            },
            room: {
              select: {
                id: true,
                roomNo: true,
                rent: true
              }
            }
          }
        }),
        this.prisma.payment.count({ where })
      ]);

      return {
        data: payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get payments by property: ${error.message}`);
    }
  }

  /**
   * Get all payments with pagination and filters
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Paginated payments
   */
  async getAllPayments(options = {}) {
    try {
      const { page = 1, limit = 10, status, tenantId, propertyId, roomId } = options;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (tenantId) where.tenantId = tenantId;
      if (propertyId) where.propertyId = propertyId;
      if (roomId) where.roomId = roomId;

      const [payments, total] = await Promise.all([
        this.prisma.payment.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobileNo: true
              }
            },
            property: {
              select: {
                id: true,
                propertyName: true,
                propertyAddress: true
              }
            },
            room: {
              select: {
                id: true,
                roomNo: true,
                rent: true
              }
            }
          }
        }),
        this.prisma.payment.count({ where })
      ]);

      return {
        data: payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get all payments: ${error.message}`);
    }
  }
}

module.exports = PaymentRepository;
