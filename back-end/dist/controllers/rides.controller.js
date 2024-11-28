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
exports.getCustomerRidesController = exports.confirmRideController = exports.estimatingRidesController = void 0;
const googleMaps_service_1 = require("../services/googleMaps.service");
const drivers_service_1 = require("../services/drivers.service");
const rides_service_1 = require("../services/rides.service");
const { rideEstimateSchema, rideConfirmSchema, } = require('../schemas/ride.schema');
const estimatingRidesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield rideEstimateSchema.validate(req.body, { abortEarly: false }); // Retorna todos os erros, não apenas o primeiro
        const { customer_id, origin, destination } = validatedData;
        //Verifica se todos os campos foram preenchidos
        if (!customer_id) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id do usuário não pode estar em branco"
            });
        }
        //Verifica se os endereços não são iguais
        if (origin === destination) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os endereços de origem e destino não podem ser o mesmo endereço"
            });
        }
        //Extraindo informações especificas 
        const leg = yield (0, googleMaps_service_1.getRouteDataService)(origin, destination); // obtem a rota 
        const distance = leg.distance.value / 1000; // distância em km
        const duration = leg.duration.text; //fornece o tempo estimado da viagem em um formato legível
        //Coordenadas de latitude e longitude do ponto de partida
        const originCoords = {
            latitude: leg.start_location.lat,
            longitude: leg.start_location.lng
        };
        //Coordenadas de latitude e longitude do ponto de destino
        const destinationCoords = {
            latitude: leg.end_location.lat,
            longitude: leg.end_location.lng
        };
        // Obtem motoristas disponíveis
        const drivers = yield (0, drivers_service_1.getDriversService)(distance);
        //Formatando Objetos de Resposta, transformando a lista original em uma nova lista 
        const optionsDrivers = drivers
            .filter((driver) => distance >= driver.min_distance) // Compara min_distance de forma correta
            .map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.vehicle,
            review: {
                rating: driver.review_rating,
                comment: driver.review || ''
            },
            review_rating: driver.review_rating,
            min_distance: driver.min_distance,
            value: parseFloat((distance * parseFloat(driver.min_distance.toString()) * 2).toFixed(2))
            //Orde a lista de acordo com o valor calculado em cada objeto
        })).sort((a, b) => a.value - b.value);
        // Finaliza a requisição com a resposta formata corretamente
        return res.status(200).json({
            origin: originCoords,
            destination: destinationCoords,
            distance,
            duration,
            options: optionsDrivers,
            routeResponse: {
                distance: leg.distance.text,
                duration: leg.duration.text,
                start_location: leg.start_location,
                end_location: leg.end_location,
                steps: leg.steps.map((step) => ({
                    distance: step.distance.text,
                    duration: step.duration.text,
                    instructions: step.html_instructions,
                })),
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: `Erro interno ao processar a solicitação | ${error.inner}`
        });
    }
});
exports.estimatingRidesController = estimatingRidesController;
const confirmRideController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield rideConfirmSchema.validate(req.body, {
            abortEarly: false,
        });
        const { customer_id, origin, destination, distance, duration, driver, value } = validatedData;
        if (!customer_id) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id do usuário não pode estar em branco"
            });
        }
        if (!origin || !destination) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os endereços de origem e destino recebidos não podem estar em branco"
            });
        }
        if (origin === destination) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os endereços de origem e destino não podem ser o mesmo endereço"
            });
        }
        const consultDriver = yield (0, drivers_service_1.getDriverByIdService)(driver.id);
        if (!consultDriver) {
            return res.status(404).json({
                error_code: "INVALID_DATA",
                error_description: "Motorista não encontrado"
            });
        }
        if (distance < consultDriver.min_distance) {
            return res.status(403).json({
                error_code: "INVALID_DATA",
                error_description: "Quilometragem inválida para o motorista"
            });
        }
        console.log("Uma opção de motorista foi informada e é uma opção válida");
        console.log("A quilometragem informada realmente é válida para o motorista selecionado");
        yield (0, rides_service_1.insterRideService)({
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driver_id: driver.id,
            value,
        });
        return res.status(200).json({
            description: "Operação sucesso",
            success: true
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: `Erro interno ao processar a solicitação ${error.inner}`
        });
    }
});
exports.confirmRideController = confirmRideController;
const getCustomerRidesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, query } = req;
    try {
        const { customer_id } = params;
        const { driver_id } = query;
        if (!customer_id) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id do usuário não pode estar em branco"
            });
        }
        //Obtem motoristas somente em caso dele ser enviado
        if (driver_id) {
            const consultDriver = yield (0, drivers_service_1.getDriverByIdService)(driver_id);
            if (!consultDriver) {
                return res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Motorista invalido"
                });
            }
        }
        // Converte driver_id para number antes de passá-lo para a função getCustomerRidesService e verifica se driver_id não é undefined.
        const numericDriverId = driver_id ? parseInt(driver_id, 10) : undefined;
        // Consultar viagens realizadas pelo cliente
        const customerRidesData = yield (0, rides_service_1.getCustomerRidesService)(customer_id, numericDriverId);
        const rides = customerRidesData.map((ride) => ({
            id: ride.id,
            date: ride.date,
            origin: ride.origin,
            destination: ride.destination,
            distance: parseFloat(ride.distance),
            duration: ride.duration,
            driver: {
                id: ride.driver_id,
                name: ride.driver_name,
            },
            value: parseFloat(ride.total_value),
        }));
        return res.status(200).json({
            customer_id,
            rides
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: `Erro interno ao processar a solicitação ${error.inner}`
        });
    }
});
exports.getCustomerRidesController = getCustomerRidesController;
