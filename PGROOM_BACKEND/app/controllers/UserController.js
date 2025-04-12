const userService = require("../services/UserService");
const Controller = require("./Controller");
const http = require("../constant/StatusCodes");
const constMessage = require("../constant/Message");
const constant = require("../constant/Constant");

class UserController extends Controller {
  constructor(userService) {
    super();
    this.userService = userService;
  }

  /**
   * fucntion to getTenants users
   */
  getTenants = async (req, res) => {
      try {
      const result = await this.userService.getTenants(req.query);
      this.sendResponse(
        res,
        result,
        constMessage.FETCH_SUCCESSFUL.replace(":name", "Tenants"),
        http.OK
      );
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  };
}

module.exports = new UserController(userService);
