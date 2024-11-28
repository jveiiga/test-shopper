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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouteDataService = getRouteDataService;
const axios_1 = __importDefault(require("axios"));
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
function getRouteDataService(origin, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        //Faz a requisição na API Route do Google
        try {
            const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/directions/json', {
                params: {
                    origin,
                    destination,
                    key: GOOGLE_MAPS_API_KEY
                }
            });
            //Verifica se os dados da requisição estão OK
            if (response.data.status !== "OK") {
                console.error('Resposta da API do Google Maps:', response.data);
                throw new Error("Falha ao calcular rota!");
            }
            //Extraindo informações especificas 
            return response.data.routes[0].legs[0]; // Retorna apenas o "leg" da rota
        }
        catch (error) {
            console.error('Erro ao acessar o Google Maps API:', error.message);
            throw new Error(`Erro ao acessar o Google Maps API: ${error.message}`);
        }
    });
}
