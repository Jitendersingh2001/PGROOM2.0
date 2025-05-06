const constant = require("../constant/Constant");
const userRepository = require("../repository/UserRepository");
const tenantRepository = require("../repository/TenantRepository");

class userService {
  constructor(repository, tenantRepository) {
    this.repository = repository;
    this.tenantRepository = tenantRepository;
  }

  /**
   * function to getTenants users
   */
  async getTenants(data) {
    try {
      const page = Number(data.page) || 1;
      const limit = Number(data.limit) || 10;
      const searchFields = ["firstName", "lastName"];
      const status = data?.status ??  null;

      // Fetch users and tenant user IDs
      const [users, tenantUserIds] = await Promise.all([
        this.repository.getUsersByRoleId(
          constant.TENANT_ROLE_ID,
          data.search,
          searchFields,
          status,
          page,
          limit
        ),
        this.tenantRepository.getTenantUserIds(),
      ]);

      // Convert tenantUserIds array to Set for optimized lookups
      const tenantUserIdSet = new Set(tenantUserIds);
      const filteredUsers = users.data.filter(
        (user) => !tenantUserIdSet.has(user.user.id)
      );

      return {
        data: filteredUsers,
        meta: {
          total: filteredUsers.length,
          page,
          limit,
          totalPages: Math.ceil(filteredUsers.length / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new userService(userRepository, tenantRepository);
