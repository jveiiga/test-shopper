
//***************** RIDE *****************

// Interface para validação de entrada
export interface RideEstimateRequest {
    customer_id: number,
    origin: string,
    destination: string
}

// Interface para a resposta final
export interface RideConfirmResponse {
    description: string;
    success: boolean;
}

// Interface para validação de entrada
export interface RideConfirmRequest {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: number;
        name: string;
    };
    value: number;
}

// Interface para a resposta final
export interface RideEstimateResponse {
    origin: Coordinates;
    destination: Coordinates;
    distance: number;
    duration: string;
    options: OptionDriver[];
    routeResponse: RouteDetail;
}

export interface CustomerRideRequest {
    customer_id: string
}

export interface CustomerRidesResponse {
    customer_id: string;
    rides: Ride[];
}

export interface OptionalCustomerRideRequest {
    driver_id?: number;
}

export interface Ride {
    id: string;
    date: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: string;
        name: string;
    };
    value: number;
}

export interface RideInsert {
    customer_id: string;
    // convert_custom_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver_id: number;
    value: number;
}

export interface ErrorResponse {
    error_code: string;
    error_description: string;
}

//***************** COORDINATES *****************

// Interface para coordenadas
export interface Coordinates {
    latitude: number;
    longitude: number;
}

//***************** DRIVER *****************

// Interface para motoristas formatados
export interface OptionDriver {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
        rating: number;
        comment: string;
    }
    value: number;
}

export interface Driver {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review_rating: number;
    review_comment: string | null;
    review: string;
    min_distance: number;
}

//***************** ROUTE *****************

// Interface para os detalhes da rota
export interface RouteDetail {
    distance: string;
    duration: string;
    start_location: { lat: number; long: number };
    end_location: { lat: number; long: number };
    steps: {
        distance: string;
        duration: string;
        instructions: string;
    }[];
}

export interface Step {
    distance: {
        text: string;
        value: number;
    };
    duration: {
        text: string;
        value: number;
    };
    html_instructions: string;
}




