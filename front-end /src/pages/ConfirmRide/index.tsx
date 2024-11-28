import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapsProvider } from '../../providers/MapsProvider';
import { api } from '../../service/api';
import { H1Container } from '../../styles/styled';
import styled from 'styled-components';

const DivContainer = styled.div`
    display: flex;
`

const UlContainer = styled.ul`
    display: flex;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 18px;
`

const LiContainer = styled.li`
    display: flex;
    flex-direction:column;
    gap: 7%;
    width: 50%;
    height: 50%;
    border: 1px solid #1E2044;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 18px;
    border-radius: 15px;

`

const PContainer = styled.p`
    font-size: 15px;
`

const ButtonContainer= styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    color: white;
    width: 100%;
    height: 35px;
    border: none;
    border-radius: 6px;
    background-color: #09A776;
    cursor: pointer;
`


export const ConfirmRide: React.FC = () => {
    const [customerId, setCustomerId] = useState<any>(null);
    const [origin, setOrigin] = useState<any>(null);
    const [destination, setDestination] = useState<any>(null);
    const [distance, setDistance] = useState<any>(null);
    const [duration, setDuration] = useState<any>(null);
    const [driverOptions, setDriverOptions] = useState<any[]>([]);
    const [routeResponse, setRouteResponse] = useState<any>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('estimateRideData') || '{}');
        setCustomerId(data.customer_id || null);
        setOrigin(data.origin || null);
        setDestination(data.destination || null);
        setDistance(data.distance || null);
        setDuration(data.duration || null);
        setDriverOptions(data.options || []);
        setRouteResponse(data.routeResponse || null);
    }, []);

    const requestConfirmRide = async (driverId: string) => {
        try {
            setError('');
            const requestBody = {
                customer_id: customerId,
                origin: origin,
                destination: destination,
                distance: distance,
                duration: duration,
                driver: {
                    id: driverId, // Recebido como argumento
                    name: driverOptions.find(driver => driver.id === driverId)?.name || 'Motorista',
                },
                value: driverOptions.find(driver => driver.id === driverId)?.value, // Estimativa de valor
            };
            await api.patch('/ride/confirm', requestBody);
            navigate('/historic');
        } catch (err) {
            setError('Erro ao confirmar viagem. Tente novamente.');
        }
    };

    return (
        <div>
            <H1Container>Opções de Viagem</H1Container>
            <DivContainer>
                {error && <p>{error}</p>}
                {routeResponse && <MapsProvider routeResponse={routeResponse} />}
                <UlContainer>
                    {driverOptions.length > 0 ? (
                        driverOptions.map((driver) => (
                            <LiContainer key={driver.id}>
                                <PContainer>Nome: {driver.name}</PContainer>
                                <PContainer>Descrição: {driver.description}</PContainer>
                                <PContainer>Veículo: {driver.vehicle}</PContainer>
                                <PContainer>Avaliação: {driver.review.rating}</PContainer>
                                <PContainer>Valor da Viagem: R${driver.value.toFixed(2)}</PContainer>
                                <ButtonContainer onClick={() => requestConfirmRide(driver.id)}>Escolher</ButtonContainer>
                            </LiContainer>
                        ))
                    ) : (
                        <p>Nenhum motorista encontrado.</p>
                    )}
                </UlContainer>
            </DivContainer>
        </div>
    );
};


