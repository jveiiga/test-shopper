import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RideMapProps } from '../../interfaces/Maps';
import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript } from '@react-google-maps/api';


export const MapsProvider: React.FC<RideMapProps> = ({ routeResponse }) => {
  console.log(process.env.GOOGLE_API_KEY)
  const apiKey = process.env.GOOGLE_API_KEY || 'default-api-key';
  
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<any>(null);
  
  // É executado routerResponse Muda
  useEffect(() => {
    if (routeResponse?.start_location && routeResponse?.end_location) {
      setOrigin(routeResponse.start_location);
      setDestination(routeResponse.end_location);
    }
  }, [routeResponse]); // Dependência: Este efeito será executado sempre que routeResponse mudar.

  // Memoiza as opções do DirectionsService para evitar recriação desnecessária.
  const directionsServiceOptions = useMemo(() => {
    if (origin && destination) {
      return {
        origin,
        destination,
        travelMode: 'DRIVING', // Define o modo de viagem como 'DRIVING'.
      } as google.maps.DirectionsRequest;
    } return null;
  }, [origin, destination]); // Dependências: Este memo será recalculado quando origin ou destination mudarem.


  // Callback para o DirectionsService. useCallback: Memoiza a função para evitar recriação desnecessária.
  const directionsCallback = useCallback((res: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (res !== null && status === 'OK') {
      setDirections(res); // Armazena as direções no estado.
    } else {
      console.error('Erro ao buscar direções:', res);
    }
  }, []);

  // Memoiza as opções do DirectionsRenderer.
  const directionsRendererOptions = useMemo(() => {
    return {
      directions,
    };
  }, [directions]); // Dependência: Este memo será recalculado quando directions mudar.

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={{ width: '60vw', height: '70vh' }}
        center={routeResponse?.start_location || { lat: 0, lng: 0 }}
        zoom={12}
        options={{ gestureHandling: 'greedy', disableDefaultUI: true }}
      >
        {/* Renderiza o DirectionsService se origin e destination estiverem definidos */}
        {origin && destination && directionsServiceOptions && (
          <DirectionsService
            options={directionsServiceOptions}
            callback={directionsCallback}
          />
        )}
        {/* Renderiza o DirectionsRenderer se directions estiver definido */}
        {directions && (
          <DirectionsRenderer options={directionsRendererOptions} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

