const BaseRepository = require("./BasePrismaRepository");
const constant = require("../constant/Constant");

class roomRepository {
  constructor() {
    this.baseRepository = new BaseRepository("rooms");
  }

  /**
   * Function to add or update a room
   */
  async addOrUpdateRoom(
    propertyId,
    roomNo,
    roomImage,
    totalBed,
    status,
    description,
    rent,
    id = null
  ) {
    try {
      const roomData = {
        propertyId,
        roomNo,
        roomImage,
        totalBed,
        status,
        description,
        rent,
      };

      // If `id` is null, create a new property
      return id === null
        ? this.baseRepository.create(roomData)
        : this.baseRepository.upsert({ id }, roomData, roomData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Function to get all rooms
   */
  async getAllRooms(propertyId, page, limit) {
    try {
      const queryOptions = {
        where: {
          propertyId: propertyId,
          status: constant.ACTIVE,
        },
        orderBy: {
          id: "asc",
        },
      };
      return this.baseRepository.paginate(queryOptions, page, limit);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Function to get a room by ID
   */
  async getRoom(roomId) {
    try {
      return this.baseRepository.findById(roomId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Function to update the status of a room
   */
  async updateRoomStatus(roomId, status) {
    try {
      return this.baseRepository.update(roomId, { status : status });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new roomRepository();
