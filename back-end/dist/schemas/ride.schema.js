"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideConfirmSchema = exports.rideEstimateSchema = void 0;
const yup = require("yup");
exports.rideEstimateSchema = yup.object({
    customer_id: yup.string().required("O id do usuário não pode estar em branco").min(1, "O ID do cliente deve conter pelo menos 1 caractere"),
    origin: yup.string().required("O endereço de origin recebido não pode estar em branco"),
    destination: yup.string().required("O endereço de destino recebido não pode estar em branco")
        .test("different-origin-destination", "Os endereços de origem e destino não podem ser o mesmo endereço", function validateValue(value) {
        //return value !== this.parent.origin; // Verifica se destino é diferente de origem
        return value !== parent.origin; // Verifica se destino é diferente de origem
    }),
});
exports.rideConfirmSchema = yup.object({
    customer_id: yup.string().required("O id do usuário não pode estar em branco").min(1, "O ID do cliente deve conter pelo menos 1 caractere"),
    origin: yup.string().required("O endereço de origin recebido não pode estar em branco"),
    destination: yup.string().required("O endereço de destino recebido não pode estar em branco")
        .test("different-origin-destination", "Os endereços de origem e destino não podem ser o mesmo endereço", function validateDestination(value) {
        //return value !== this.parent.origin; // Garante que origem ≠ destino
        return value !== parent.origin; // Garante que origem ≠ destino
    }),
    distance: yup.number().required("A distância não pode estar em branco").positive("A distância deve ser maior que zero")
        .typeError("A distância deve ser um número válido"),
    duration: yup.string().required("A duração não pode estar em branco")
        .matches(/^(\d+h)?( ?e ?\d{1,2} min)?$|^(\d+h)?(\d{1,2} mins)?$|^\d{1,2} mins$/, "A duração deve ser válida (ex.: '1 e 2min', '2h30mins' ou '30mins')"),
    driver: yup
        .object({
        id: yup.number().required("O ID do motorista não pode estar em branco").integer("O ID do motorista deve ser um número inteiro")
            .positive("O ID do motorista deve ser um número positivo")
            .typeError("O ID do motorista deve ser um número"),
        name: yup.string().required("O nome do motorista não pode estar em branco"),
    })
        .required("Os dados do motorista são obrigatórios"),
    value: yup.number().required("O valor da corrida não pode estar em branco").positive("O valor da corrida deve ser maior que zero")
        .typeError("O valor da corrida deve ser um número válido"),
});
