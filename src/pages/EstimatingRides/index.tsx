import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { api } from '../../service/api';
import { ButtonContainer, DivContainer, H1Container, InputContainer } from '../../styles/styled';

export const EstimatingRides: React.FC = () => {
    const [customer_id, setCustomer_id] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const requestEstimateRide = async () => {
        try {
            setError('');
            const estimateRideResponse = await api.post('/ride/estimate', {
                customer_id,
                origin,
                destination,
            },
            );
            console.log("Console estimateRideResponse", estimateRideResponse)

            const rideData = {
                ...estimateRideResponse.data,
                customer_id,
                origin,
                destination // Inclui o customer_id, origin, destination no objeto
            };

            localStorage.setItem('estimateRideData', JSON.stringify(rideData));
            navigate('/options')
            window.location.reload();
        } catch (error) {
            setError('Erro ao solicitar viagem. Tente novamente.')
        }
    }

    return (
        <DivContainer>
            <H1Container>Solicitação de viagens</H1Container>
            {error && <p>{error}</p>}
            <InputContainer placeholder="ID do Usuário" type="text" value={customer_id} onChange={(e) => setCustomer_id(e.target.value)} />
            <InputContainer placeholder="Endereço de Origem" type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            <InputContainer placeholder="Endereço de Destino" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <ButtonContainer onClick={requestEstimateRide}>Estimar Valor da viagem</ButtonContainer>
        </DivContainer>
    );
};