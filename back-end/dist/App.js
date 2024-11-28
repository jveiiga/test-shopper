"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const rides_router_1 = __importDefault(require("./routers/rides.router"));
const ride_middleware_1 = __importDefault(require("./middlewares/ride.middleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(rides_router_1.default, ride_middleware_1.default);
exports.default = app;
