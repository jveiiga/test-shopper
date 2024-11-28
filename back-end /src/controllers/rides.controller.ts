// POST /ride/estimate
// 1 - O id do usuário não pode estar em branco. ✓
// 2 - Os endereços de origem e destino não podem ser o mesmo endereço. ✓
// Após as validações, ele deve:
// 3 - Calcular a rota entre a origem e destino usando a API Routes do Google Maps. ✓
// 4 - Com base no retorno, deve listar os motoristas disponíveis para a viagem de acordo com a quilometragem mínima que aceitam, cada um com seu respectivo valor, usando como base a tabela. ✓
// *************************
// PATCH /ride/confirm
// 1 - Os endereços de origem e destino recebidos não podem estar em branco. ✓
// 2 - O id do usuário não pode estar em branco. ✓
// 3 - Os endereços de origem e destino não podem ser o mesmo endereço. ✓
// 4 - Uma opção de motorista foi informada e é uma opção válida. ✓
// 5 - A quilometragem informada realmente é válida para o motorista selecionado. ✓
// Após as validações ele deve:
// 6 -  Salvar no banco de dados os dados da viagem realizada. ✓
// 7 - Ele NÃO deve fazer: Recalcular a rota usando a API do Google Maps ✓
// 8 - Ela irá retornar: Resposta de OK ou ERRO dependendo do valor informado. ✓
// *************************
// GET /ride/{customer_id}?driver_id={id do motorista}
// 1 - O id do usuário não pode estar em branco. ✓
// 2 - Se um id de motorista for informado, ele precisa ser um id válido. ✓
// Após as validações ele:
// 3 - Busca as viagens realizadas pelo usuário, ordenando da mais recente para a mais antiga.✓
// 4 - Pode receber um query parameter “driver_id” que, se informado, deve filtrar apenas as viagens realizadas pelo usuário com este motorista.
import { Request, Response } from 'express';
import {
    RideConfirmRequest,
    RideEstimateRequest,
    Coordinates,
    OptionDriver,
    RideEstimateResponse,
    Step,
    RideConfirmResponse,
    Ride,
    CustomerRideRequest,
    OptionalCustomerRideRequest,
    CustomerRidesResponse,
    ErrorResponse,
    Driver
} from '../interface/RideInterface'
import { getRouteDataService } from '../services/googleMaps.service';
import { getDriversService, getDriverByIdService } from '../services/drivers.service';
import { insterRideService, getCustomerRidesService } from '../services/rides.service';
import { rideEstimateSchema, rideConfirmSchema } from '../schemas/ride.schema';

export const estimatingRidesController= async (
    req: Request<{}, {}, RideEstimateRequest>,
    res: Response<RideEstimateResponse | ErrorResponse>
): Promise<void> => {
        try {
            const validatedData = await rideEstimateSchema.validate(req.body, { abortEarly: false }); // Retorna todos os erros, não apenas o primeiro

            const { customer_id, origin, destination } = validatedData;
            //Verifica se todos os campos foram preenchidos
            if (!customer_id) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O id do usuário não pode estar em branco"
                });
                return;
            }
            //Verifica se os endereços não são iguais
            if (origin === destination) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Os endereços de origem e destino não podem ser o mesmo endereço"
                });
                return;
            }

            //Extraindo informações especificas 
            const leg = await getRouteDataService(origin, destination); // obtem a rota 
            const distance = leg.distance.value / 1000; // distância em km
            const duration = leg.duration.text; //fornece o tempo estimado da viagem em um formato legível
            //Coordenadas de latitude e longitude do ponto de partida
            const originCoords: Coordinates = {
                latitude: leg.start_location.lat,
                longitude: leg.start_location.lng
            };
            //Coordenadas de latitude e longitude do ponto de destino
            const destinationCoords: Coordinates = {
                latitude: leg.end_location.lat,
                longitude: leg.end_location.lng
            };

            // Obtem motoristas disponíveis
            const drivers = await getDriversService(distance);
            //Formatando Objetos de Resposta, transformando a lista original em uma nova lista 
            const optionsDrivers: OptionDriver[] = drivers
                .filter((driver: Driver) => distance >= driver.min_distance) // Compara min_distance de forma correta
                .map((driver: Driver) => ({
                    id: driver.id,
                    name: driver.name,
                    description: driver.description,
                    vehicle: driver.vehicle,
                    review: {
                        rating: driver.review_rating,
                        comment: driver.review || ''
                    },
                    value: parseFloat((distance * parseFloat(driver.min_distance.toString()) * 2).toFixed(2))
                    //Ordena lista de acordo com o valor calculado em cada objeto
                })).sort((a: OptionDriver, b: OptionDriver) => a.value - b.value);

            // Finaliza a requisição com a resposta formata corretamente
            res.status(200).json({
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
                    steps: leg.steps.map((step: Step) => ({
                        distance: step.distance.text,
                        duration: step.duration.text,
                        instructions: step.html_instructions,
                    })),
                },
            });

        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: `Erro interno ao processar a solicitação | ${error.inner}`
            });
        }
};

export const confirmRideController = async (
    req: Request<{}, {}, RideConfirmRequest>,
    res: Response<RideConfirmResponse | ErrorResponse>
): Promise<void> => {
    try {
        const validatedData = await rideConfirmSchema.validate(req.body, {
            abortEarly: false,
        });

        const { origin, destination, distance, duration, driver, value } = validatedData;
        let { customer_id } = validatedData;

        if (!customer_id) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id do usuário não pode estar em branco"
            });
            return;
        }

        if (!origin || !destination) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os endereços de origem e destino recebidos não podem estar em branco"
            });
            return;
        }

        if (origin === destination) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os endereços de origem e destino não podem ser o mesmo endereço"
            });
            return;
        }

        const consultDriver = await getDriverByIdService(driver.id);
        if (!consultDriver) {
            res.status(404).json({
                error_code: "INVALID_DATA",
                error_description: "Motorista não encontrado"
            });
            return;
        }

        if (distance < consultDriver.min_distance) {
            res.status(403).json({
                error_code: "INVALID_DATA",
                error_description: "Quilometragem inválida para o motorista"
            });
            return
        }

        console.log("Uma opção de motorista foi informada e é uma opção válida");

        console.log("A quilometragem informada realmente é válida para o motorista selecionado");

        customer_id = customer_id.toLowerCase()

        await insterRideService({
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driver_id: driver.id,
            value,
        });

        res.status(200).json({
            description: "Operação sucesso",
            success: true
        })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: `Erro interno ao processar a solicitação ${error.inner}`
        });
    }
};

export const getCustomerRidesController = async (
    req: Request<CustomerRideRequest, {}, {}, OptionalCustomerRideRequest>,
    res: Response<CustomerRidesResponse | ErrorResponse>
): Promise<void> => {
    const { params, query } = req;
    try {
        const { customer_id } = params;
        const { driver_id } = query;

        if (!customer_id) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id do usuário não pode estar em branco"
            });
            return;
        }

        //Obtem motoristas somente em caso dele ser enviado
        if (driver_id) {
            const consultDriver = await getDriverByIdService(driver_id);
            if (!consultDriver) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Motorista invalido"
                });
                return;
            }
        }

        // Consultar viagens realizadas pelo cliente
        const customerRidesData = await getCustomerRidesService(customer_id.toLowerCase(), driver_id);
        const rides: Ride[] = customerRidesData.map((ride: any) => ({
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

        res.status(200).json({
            customer_id,
            rides
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: `Erro interno ao processar a solicitação ${error.inner}`
        })
    }
}