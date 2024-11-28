import { pool } from '../config/database';

import { Ride, RideInsert } from '../interface/RideInterface';

export async function insterRideService({ customer_id, origin, destination, distance, duration, driver_id, value }: RideInsert): Promise<void> {
    try {
        const rideQuery = `
            INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, total_value)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(rideQuery, [customer_id, origin, destination, distance, duration, driver_id, value]);
    } catch (error: any) {
        throw new Error(`Erro ao inserir corrida no banco de dados: ${error.message}`);
    }
}

export async function getCustomerRidesService(customer_id: string, driver_id?: number): Promise<Ride[]> {
    try {
        let rideQuery = `
            SELECT r.id, r.created_at AS date, r.origin, r.destination, r.distance, r.duration, r.total_value,
                    d.id AS driver_id, d.name AS driver_name
            FROM rides r
            INNER JOIN drivers d ON r.driver_id = d.id
            WHERE r.customer_id = $1
        `;
        const queryParams: (string | number)[] = [customer_id];

        if (driver_id) {
            rideQuery += ' AND r.driver_id = $2';
            queryParams.push(driver_id);
        }

        rideQuery += ' ORDER BY r.created_at DESC';

        const queryResult = await pool.query(rideQuery, queryParams);
        return queryResult.rows as Ride[];
    } catch (error: any) {
        throw new Error(`Erro ao buscar corridas de um usuário no banco de dados: ${error.message}`);
    }
}