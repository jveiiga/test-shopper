"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateParamsCustomerId = (req, res, next) => {
    const { customer_id } = req.params;
    // Verifica se 'customer_id' não foi passado 
    if (!customer_id) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "O id do usuário não pode estar em branco"
        });
    }
    next();
};
exports.default = validateParamsCustomerId;
