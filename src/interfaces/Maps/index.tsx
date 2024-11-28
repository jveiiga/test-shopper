export interface RideMapProps {
  routeResponse: {
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    steps: Array<{ instructions: string; distance: string; duration: string }>;
  };
}

