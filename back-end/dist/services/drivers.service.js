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
exports.getDriversService = getDriversService;
exports.getDriverByIdService = getDriverByIdService;
const database_1 = require("../config/database");
function getDriversService(distance) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Consulta motoristas no banco de dados
            const driversQuery = ` 
            SELECT id, name, description, vehicle, review_rating, review_comment, min_distance 
            FROM drivers 
            WHERE min_distance <= $1
        `;
            //Executa a instrução SQL e [distance] substitui o placeholder $1 na query
            const driverResult = yield database_1.pool.query(driversQuery, [distance]);
            return driverResult.rows;
        }
        catch (error) {
            throw new Error(`Erro ao buscar motoristas no banco de dados: ${error.message}`);
        }
    });
}
function getDriverByIdService(driver_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const driversQuery = `
                SELECT * 
                FROM drivers 
                WHERE id = $1;
            `;
            const driverResult = yield database_1.pool.query(driversQuery, [driver_id]);
            //Garante que todos os dados são válidos
            if ((driverResult === null || driverResult === void 0 ? void 0 : driverResult.rowCount) && driverResult.rowCount > 0) {
                return driverResult.rows[0];
            }
            return null;
        }
        catch (error) {
            throw new Error(`Erro ao buscar motorista por ID no banco de dados: ${error.message}`);
        }
    });
}
