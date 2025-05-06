const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const validators = require("../validators/index");
const validateRequest = require("../middleware/ValidationMiddleware");
const {
  uploadImages,
  validateFileUpload,
} = require("../middleware/MulterMiddleware");

/**
 * Property Routes
 */
router
  .route("/property")
  .post(
    uploadImages,
    validateFileUpload,
    validateRequest(validators.PropertyValidator),
    controller.PropertyController.addProperty
  )
  .put(
    uploadImages,
    validateFileUpload,
    validateRequest(validators.PropertyValidator),
    controller.PropertyController.updateProperty
  );

router
  .route("/property/:id")
  .get(controller.PropertyController.getProperty)
  .delete(controller.PropertyController.deleteProperty);

router.post("/properties", controller.PropertyController.getAllProperties);

router.put(
  "/propertyStatus",
  validateRequest(validators.PropertyStatusValidator),
  controller.PropertyController.updatePropertyStatus
);

/**
 * ROOM ROUTES
 */

router
  .route("/room")
  .post(
    uploadImages,
    validateFileUpload,
    validateRequest(validators.RoomValidator),
    controller.RoomController.addRoom
  )
  .put(
    uploadImages,
    validateFileUpload,
    validateRequest(validators.RoomValidator),
    controller.RoomController.updateRoom
  );

router.post("/rooms", controller.RoomController.getAllRooms);

router
  .route("/room/:id")
  .get(controller.RoomController.getRoom)
  .delete(controller.RoomController.deleteRoom);

/**
 * USER ROUTES
 */
router.post("/getTenants", controller.UserController.getTenants);

/**
 * TENANT ROUTES
 */
router
  .route("/tenant")
  .post(
    validateRequest(validators.TenantValidator),
    controller.TenantController.createTenant
  )
  .put(
    validateRequest(validators.TenantValidator),
    controller.TenantController.updateTenant
)
  .get(
    controller.TenantController.getTenants
  );

module.exports = router;
