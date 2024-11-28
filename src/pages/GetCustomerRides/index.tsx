import React, { useState } from "react";
import { api } from "../../service/api";
import { H1Container } from "../../styles/styled";
import styled from "styled-components";

const DivContainer = styled.div`
    display: flex;
    justify-content: center;
    `

const DivContainerForm = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;

`

const DivContainerList = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
`


const TableContainer = styled.table`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
`

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`

const ContainerForm = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 70%;

`


const TrContainer = styled.tr`
    display: flex;
    flex-direction:column;
    // align-items: center;
    gap: 7%;
    width: 80%;
    height: 100%;
    border: 1px solid #1E2044;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 18px;
    border-radius: 15px;
    padding-left: 10%;
`

const InputContainer = styled.input`
    color: rgb(102, 102, 102);
    width: 50%;
    padding: 5px 0px;
    font-size: 1rem;
    border-top: none;
    border-right: none;
    border-left: none;
    border-image: initial;
    line-height: 1.15;
    background: transparent;
    transition: border-bottom-color 0.3s;
    border-bottom: 1px solid rgb(102, 102, 102) !important;
    margin: 0 0 50px 0;
`;


const ButtonContainer = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    color: white;
    width: 50%;
    height: 35px;
    border: none;
    border-radius: 6px;
    background-color: #09A776;
    cursor: pointer;
    margin-top: 50px;
`


export const GetCustomerRides: React.FC = () => {
    const [rides, setRides] = useState<any[]>([]); // Dados das viagens
    const [driverFilter, setDriverFilter] = useState<any[]>([]); // Filtro de motoristas
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
    const [userId, setUserId] = useState<string>(''); // ID do usuário (input e API)
    const [selectedDriverId, setSelectedDriverId] = useState<string>('all'); // ID do motorista (input e filtro)

    const fetchCustomerRides = async () => {
        try {
            setLoading(true);
            setError('');
            const params: any = {};
            if (selectedDriverId !== 'all') {
                params.driver_id = selectedDriverId;
            }
            const responseCustomerRidesData = await api.get(`/ride/${userId}`, { params });

            const { rides: customerRidesData } = responseCustomerRidesData.data;

            // Extrai motoristas únicos das viagens
            // Cria um novo array a partir de um Set para garantir a exclusividade.
            const customerDriver = Array.from(
                // Mapeia customerRidesData para uma array de strings JSON que representam os motoristas.
                new Set(customerRidesData.map((ride: any) =>
                    // Converte o objeto {id, name} do motorista em uma string JSON.
                    JSON.stringify({ id: ride.driver.id, name: ride.driver.name })))
                // Converte cada string JSON de volta em um objeto.
            ).map((driver: any) => JSON.parse(driver));

            setDriverFilter(customerDriver);
            setRides(customerRidesData);
        } catch (error) {
            setError('Erro ao buscar viagens. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <H1Container>Histórico de Viagens</H1Container>
            <DivContainer>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensagem de erro */}

                {/* Campo para o ID do Usuário */}
                <DivContainerForm>
                    <ContainerForm>

                        <label>
                            ID do Usuário:
                        </label>
                        <InputContainer
                            type="text"
                            value={userId || ''}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Digite o ID do usuário"
                        />


                        {/* Filtro de Motoristas */}
                        {userId && (
                            <Container>
                                <label>
                                    Motorista:
                                </label>
                                {/* setSelectedDriverId recebe o valor do select e selectedDriverId é atualizado e usado para verificar se ele é diferente de all*/}
                                <select
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                >
                                    {/*Por padrão seu valor é all e trás todos os motoristas, o map defini todas as opções de filtro pelo nome do motorista, a chave e o valor do option são o id do motorista*/}
                                    <option value="all">Todos</option>
                                    {driverFilter.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name}
                                        </option>
                                    ))}
                                </select>
                            </Container>
                        )}

                        {/* Botão para Filtrar */}
                        <ButtonContainer onClick={fetchCustomerRides} disabled={!userId}>
                            Aplicar Filtro
                        </ButtonContainer>
                    </ContainerForm>
                </DivContainerForm>

                {/* Tabela de Viagens */}
                {/* Mensagem de carregamento */}
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <DivContainerList>
                        <h2>Viagens</h2>
                        {/* Mensagem quando não há viagens */}
                        {rides.length === 0 ? (
                            <p>Nenhuma viagem encontrada.</p>
                        ) : (
                            <TableContainer>
                                <thead>
                                </thead>
                                <tbody>
                                    {rides.map((ride) => (
                                        <TrContainer key={ride.id}>
                                            <Container>
                                                <th>Data e Hora</th>
                                                <td>{new Date(ride.date).toLocaleString()}</td>
                                            </Container>
                                            <Container>
                                                <th>Motorista</th>
                                                <td>{ride.driver.name}</td>
                                            </Container>
                                            <Container>
                                                <th>Origem</th>
                                                <td>{ride.origin}</td>
                                            </Container>
                                            <Container>
                                                <th>Destino</th>
                                                <td>{ride.destination}</td>
                                            </Container>
                                            <Container>
                                                <th>Distância</th>
                                                <td>{ride.distance.toFixed(2)} km</td>
                                            </Container>
                                            <Container>
                                                <th>Tempo</th>
                                                <td>{ride.duration}</td>
                                            </Container>
                                            <Container>
                                                <th>Valor</th>
                                                <td>R$ {ride.value.toFixed(2)}</td>
                                            </Container>
                                        </TrContainer>
                                    ))}
                                </tbody>
                            </TableContainer>
                        )}
                    </DivContainerList>
                )}
            </DivContainer>
        </div>
    );
};