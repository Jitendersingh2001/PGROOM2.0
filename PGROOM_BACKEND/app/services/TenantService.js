const constant = require("../constant/Constant");
const tenantRepository = require("../repository/TenantRepository");
const { parseInputData } = require("../utils/DataParseHelper");

class tenantService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Function to create tenant
   */
  async createTenant(data) {
    try {
      const parsedData = parseInputData(data, {
        integerFields: ["propertyId", "roomId"],
        integerArrayFields: ["userIds"],
      });

      return await Promise.all(
        parsedData.userIds.map((userId) =>
          this.repository.createOrUpdateTenant(
            userId,
            parsedData.propertyId,
            parsedData.roomId
          )
        )
      );
    } catch (error) {
      throw error;
    }
  }

  /*
   * Function to update tenant assignments for a given property and room.
   * It deletes removed tenants, restores deleted ones, and creates new tenants as needed.
   */
  async updateTenant(data) {
    try {
      // Parse and validate input data
      const {
        propertyId,
        roomId,
        userIds = [],
        ids = [],
      } = parseInputData(data, {
        integerFields: ["propertyId", "roomId"],
        integerArrayFields: ["userIds", "ids"],
      });

      // Fetch current tenants from the database
      const existingTenants = await this.repository.getTenants(
        propertyId,
        roomId
      );
      const existingIds = existingTenants.map(({ id }) => id);

      // Handle deletions: remove tenants that are no longer in the updated list
      await this.#handleDeletions(existingIds, ids);

      // Handle creations and restorations of tenants
      await this.#handleCreationsAndRestorations(propertyId, roomId, userIds);

      return true;
    } catch (error) {
      // Wrap error with more context
      throw new Error(`updateTenant failed: ${error.message}`);
    }
  }

  /*
   * Delete tenants that exist in DB but are not in the updated tenant ID list.
   */
  async #handleDeletions(existingIds, updatedTenantIds) {
    const idsToDelete = existingIds.filter(
      (id) => !updatedTenantIds.includes(id)
    );
    if (idsToDelete.length > 0) {
      await this.deleteTenant({ ids: idsToDelete });
    }
  }

  /*
   * Restore previously deleted tenants if included in the new list,
   * and create new tenants that were not previously present.
   */
  async #handleCreationsAndRestorations(propertyId, roomId, userIds) {
    if (userIds.length === 0) return;

    // Get previously deleted tenants for the property and room
    const deletedTenants = await this.repository.getTenants(
      propertyId,
      roomId,
      constant.DELETED
    );

    // Find tenants to restore from deleted list
    const tenantsToRestore = deletedTenants.filter((tenant) =>
      userIds.includes(tenant.userId)
    );
    const restoredUserIds = tenantsToRestore.map((t) => t.userId);
    const idsToRestore = tenantsToRestore.map((t) => t.id);

    // Restore deleted tenants
    if (idsToRestore.length > 0) {
      await Promise.all(
        idsToRestore.map((id) => this.repository.updateTenant(id))
      );
    }

    // Create tenants that are not in the restored list
    const newUserIds = userIds.filter((id) => !restoredUserIds.includes(id));
    if (newUserIds.length > 0) {
      await this.createTenant({ propertyId, roomId, userIds: newUserIds });
    }
  }

  /**
   * Function to get tenants
   */
  async getTenants(data) {
    try {
      const parsedData = parseInputData(data, {
        integerFields: ["propertyId", "roomId"],
      });

      // Fetch tenants from the repository using propertyId and roomId
      const tenants = await this.repository.getTenants(
        parsedData.propertyId,
        parsedData.roomId
      );

      return tenants.map((tenant) => ({
        id: tenant.id,
        userId: tenant.userId,
        username: `${tenant.user.firstName} ${tenant.user.lastName}`,
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to delete tenant
   */
  async deleteTenant(data) {
    try {
      const ids = data.ids.map((id) => parseInt(id, 10));

      return await Promise.all(
        ids.map((id) => this.repository.updateTenant(id, constant.DELETED))
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new tenantService(tenantRepository);
