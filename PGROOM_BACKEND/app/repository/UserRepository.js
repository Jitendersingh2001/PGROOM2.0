const BaseRepository = require("./BasePrismaRepository");
const constant = require("../constant/Constant");
const { paginate } = require("../utils/Helper");

class userRepository {
  constructor() {
    this.baseRepository = new BaseRepository("userRoleLink");
  }

  #buildSearchConditions(searchInput, searchFields) {
    if (!searchInput) return undefined;

    return searchFields.map((field) => ({
      [field]: { contains: searchInput, mode: "insensitive" },
    }));
  }

  #buildSelectedColumns(defaultColumns, additionalColumns) {
    return additionalColumns.reduce(
      (acc, column) => {
        acc[column] = true;
        return acc;
      },
      { ...defaultColumns }
    );
  }
  /**
   * function to get user ids by role id
   */
  async getUsersByRoleId(
    roleId,
    searchInput,
    searchFields,
    status,
    page,
    limit,
    additionalColumns = [],
    stateId = null,
    cityId = null
  ) {
    try {
      const defaultColumns = {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      };
  
      const searchConditions = this.#buildSearchConditions(searchInput, searchFields);
      const selectedColumns = this.#buildSelectedColumns(defaultColumns, additionalColumns);
  
      selectedColumns.state = { select: { stateName: true } };
      selectedColumns.city = { select: { cityName: true } };
  
      const userWhere = {
        ...(status ? { status } : { NOT: { status: "Deleted" } }),
        ...(stateId && { stateId }),
        ...(cityId && { cityId }),
        OR: searchConditions,
      };
  
      const queryOptions = {
        where: {
          roleId,
          user: userWhere,
        },
        select: {
          user: {
            select: selectedColumns,
          },
        },
      };
  
      return this.baseRepository.paginate(queryOptions, page, limit);
    } catch (error) {
      throw error;
    }
  }
  
}

module.exports = new userRepository();
