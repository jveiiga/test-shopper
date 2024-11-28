"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rides_controller_1 = require("../controllers/rides.controller");
const router = express_1.default.Router();
router.post('/ride/estimate', rides_controller_1.estimatingRidesController);
router.patch('/ride/confirm', rides_controller_1.confirmRideController);
router.get('/ride/:customer_id', rides_controller_1.getCustomerRidesController);
exports.default = router;
