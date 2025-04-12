const tenantService = require("../services/TenantService");
const Controller = require("./Controller");
const http = require("../constant/StatusCodes");
const constMessage = require("../constant/Message");
const constant = require("../constant/Constant");
const { sendError, getMissingFields } = require("../utils/Helper");

class TenantController extends Controller {
  constructor(tenantService) {
    super();
    this.tenantService = tenantService;
  }

  createTenant = async (req, res) => {
    try {
      const result = await this.tenantService.createTenant(req.body);
      this.sendResponse(
        res,
        result,
        constMessage.FETCH_SUCCESSFUL.replace(":name", "Tenant"),
        http.OK
      );
    } catch (error) {
      return this.sendErrorResponse(res, error);
    }
  };

  updateTenant = async (req, res) => {
    try {
      const result = await this.tenantService.updateTenant(req.body);
      this.sendResponse(
        res,
        result,
        constMessage.UPDATED_SUCCESSFULLY.replace(":name", "Tenant"),
        http.OK
      );
    } catch (error) {
      return this.sendErrorResponse(res, error);
    }
  };

  getTenants = async (req, res) => {
    try {
      const requiredFields = ["propertyId", "roomId"];
      const missing = getMissingFields(req.query, requiredFields);

      if (missing) {
        const message = constMessage.REQUIRED.replace(":name", missing);
        return sendError(res, message, http.BAD_REQUEST);
      }
      const result = await this.tenantService.getTenants(req.query);
      this.sendResponse(
        res,
        result,
        constMessage.FETCH_SUCCESSFUL.replace(":name", "Tenant"),
        http.OK
      );
    } catch (error) {
      return this.sendErrorResponse(res, error);
    }
  };
}

module.exports = new TenantController(tenantService);
