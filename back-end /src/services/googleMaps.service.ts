import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_API_KEY;

export async function getRouteDataService(origin: string, destination: string) {
    //Faz a requisição na API Route do Google
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
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
    } catch (error: any) {
        console.error('Erro ao acessar o Google Maps API:', error.message);
        throw new Error(`Erro ao acessar o Google Maps API: ${error.message}`);
    }
}
