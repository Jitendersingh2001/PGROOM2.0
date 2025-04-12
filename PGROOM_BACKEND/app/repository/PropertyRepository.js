const BaseRepository = require("./BasePrismaRepository");
const constant = require("../constant/Constant");

class PropertyRepository {
  constructor() {
    this.baseRepository = new BaseRepository("userProperties");
  }

  /**
   * Function to add or update a property
   */
  async addOrUpdateProperty(
    userId,
    state,
    city,
    propertyName,
    propertyImage,
    propertyContact,
    propertyAddress,
    status,
    id = null
  ) {
    try {
      const propertyData = {
        userId,
        state,
        city,
        propertyName,
        propertyImage,
        propertyContact,
        propertyAddress,
        status,
      };

      // Delegate to BaseRepository's create or upsert methods
      return id === null
        ? this.baseRepository.create(propertyData)
        : this.baseRepository.upsert({ id }, propertyData, propertyData);
    } catch (error) {
      throw new Error(`Error adding or updating property: ${error.message}`);
    }
  }

  /**
   * Function to get all properties with pagination
   */
  async getAllProperties(userId, page, limit) {
    try {
      const queryOptions = {
        where: {
          userId: userId,
          status: constant.ACTIVE,
        },
        include: {
          user: {
            include: {
              state: true,
              city: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      };

      // Use BaseRepository's paginate method
      return this.baseRepository.paginate(queryOptions, page, limit);
    } catch (error) {
      throw new Error(`Error fetching properties: ${error.message}`);
    }
  }

  /**
   * Function to update the status of a property
   */
  async updatePropertyStatus(id, status) {
    try {
      // Delegate to BaseRepository's update method
      return this.baseRepository.update(id, { status });
    } catch (error) {
      throw new Error(`Error updating property status: ${error.message}`);
    }
  }
}

module.exports = PropertyRepository;