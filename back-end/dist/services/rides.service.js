"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insterRideService = insterRideService;
exports.getCustomerRidesService = getCustomerRidesService;
const database_1 = require("../config/database");
function insterRideService(_a) {
    return __awaiter(this, arguments, void 0, function* ({ customer_id, origin, destination, distance, duration, driver_id, value }) {
        try {
            const rideQuery = `
            INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, total_value)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
            yield database_1.pool.query(rideQuery, [customer_id, origin, destination, distance, duration, driver_id, value]);
        }
        catch (error) {
            throw new Error(`Erro ao inserir corrida no banco de dados: ${error.message}`);
        }
    });
}
function getCustomerRidesService(customer_id, driver_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let rideQuery = `
            SELECT r.id, r.created_at AS date, r.origin, r.destination, r.distance, r.duration, r.total_value,
                    d.id AS driver_id, d.name AS driver_name
            FROM rides r
            INNER JOIN drivers d ON r.driver_id = d.id
            WHERE r.customer_id = $1
        `;
            const queryParams = [customer_id];
            if (driver_id) {
                rideQuery += ' AND r.driver_id = $2';
                queryParams.push(driver_id);
            }
            rideQuery += ' ORDER BY r.created_at DESC';
            const queryResult = yield database_1.pool.query(rideQuery, queryParams);
            return queryResult.rows;
        }
        catch (error) {
            throw new Error(`Erro ao buscar corridas de um usuário no banco de dados: ${error.message}`);
        }
    });
}
