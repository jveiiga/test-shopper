import { pool } from '../config/database';
import { Driver } from '../interface/RideInterface';

export async function getDriversService(distance: number): Promise<Driver[]> {
    try {
        //Consulta motoristas no banco de dados
        const driversQuery = ` 
            SELECT id, name, description, vehicle, review_rating, review_comment, min_distance 
            FROM drivers 
            WHERE min_distance <= $1
        `;
        //Executa a instrução SQL e [distance] substitui o placeholder $1 na query
        const driverResult = await pool.query(driversQuery, [distance]);
        return driverResult.rows as Driver[];
    } catch (error: any) {
        throw new Error(`Erro ao buscar motoristas no banco de dados: ${error.message}`);
    }
}

export async function getDriverByIdService(driver_id: number): Promise<Driver | null> {
    try {
        const driversQuery = `
                SELECT * 
                FROM drivers 
                WHERE id = $1;
            `
        const driverResult = await pool.query(driversQuery, [driver_id]);
        //Garante que todos os dados são válidos
        if (driverResult?.rowCount && driverResult.rowCount > 0) {
            return driverResult.rows[0];
        }
        return null;
    } catch (error: any) {
        throw new Error(`Erro ao buscar motorista por ID no banco de dados: ${error.message}`);
    }
}