const BaseRepository = require("./BasePrismaRepository");
const constant = require("../constant/Constant");

class TenantRepository {
  constructor() {
    this.baseRepository = new BaseRepository("tenant");
    this.dbClient = this.baseRepository.getDBClient();
  }

  /**
   * Function to create tenant
   */
  async createOrUpdateTenant(userId, propertyId, roomId, id = null) {
    try {
      const tenantData = {
        userId,
        propertyId,
        roomId,
        status: constant.ACTIVE,
      };

      return id === null
        ? this.baseRepository.create(tenantData)
        : this.baseRepository.upsert({ id }, tenantData, tenantData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to get tenant user ids
   */
  async getTenantUserIds() {
    try {
      const tenants = await this.dbClient.tenant.findMany({
        where: {
          status: constant.ACTIVE,
        },
        select: {
          userId: true,
        },
      });
      return tenants.map((tenant) => tenant.userId);
    } catch (error) {
      throw error;
    }
  }

  async getTenants(propertyId, roomId, status = constant.ACTIVE) {
    try {
      return await this.dbClient.tenant.findMany({
        where: {
          propertyId: propertyId,
          roomId: roomId,
          status: status,
        },
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to delete tenant
   */
  async updateTenant(id, status = constant.ACTIVE) {
    try {
      return await this.baseRepository.update(id, { status });
    } catch (error) {
      throw error;
    }
  }

  async deleteTenant(id) {
    try {
      return await this.baseRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getAssignedTenantsCount(roomIds, status = constant.ACTIVE) {
    try {
      return await this.dbClient.tenant.count({
        where: {
          roomId: {
            in: roomIds.map((room) => room.id),
          },
          status: status,
        },
      });
    } catch (error) {
      throw new Error(
        `Error fetching assigned tenants count: ${error.message}`
      );
    }
  }

  /**
   * Function to get tenant ID by user ID
   * Returns the User ID (not Tenant table ID) to match Payment schema
   */
  async getTenantIdByUserId(userId) {
    try {
      const tenant = await this.dbClient.tenant.findFirst({
        where: {
          userId: userId,
          status: constant.ACTIVE,
        },
        select: {
          id: true,
          userId: true, // Add userId to select
        },
      });
      // Return userId (User ID) instead of tenant.id (Tenant table ID)
      // This matches the Payment schema which expects tenantId to be User ID
      return tenant ? tenant.userId : null;
    } catch (error) {
      throw new Error(`Error fetching tenant ID: ${error.message}`);
    }
  }

  /**
   * Function to get tenant's room details by user ID
   */
  async getTenantRoomByUserId(userId) {
    try {
      return await this.dbClient.tenant.findFirst({
        where: {
          userId: userId,
          status: constant.ACTIVE,
        },
        include: {
          Rooms: {
            include: {
              userProperties: {
                select: {
                  id: true,
                  propertyName: true,
                  propertyAddress: true,
                  status: true,
                },
              },
              Tenant: {
                where: { status: constant.ACTIVE },
                select: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Error fetching tenant room details: ${error.message}`);
    }
  }
}

module.exports = new TenantRepository();