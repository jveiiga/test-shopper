CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    vehicle VARCHAR(50),
    review_rating NUMERIC(3, 2),
    review_comment TEXT,
    min_distance NUMERIC(10, 2) NOT NULL
);


CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance NUMERIC(10, 2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    driver_id INT NOT NULL REFERENCES drivers(id),
    value NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO drivers (name, description, vehicle, review_rating, review_comment, min_distance)
VALUES 
('Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 'Plymouth Valiant 1973 rosa e enferrujado', 2.0, 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.', 2.50),
('Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 'Dodge Charger R/T 1970 modificado', 4.0, 'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!', 5.00),
('James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 'Aston Martin DB5 clássico', 5.0, 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.', 10.00);
