import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex('drivers').del();

  // Insere novos dados
  await knex('drivers').insert([
    {
      name: 'Homer Simpson',
      description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
      vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
      review_rating: 2.0,
      review_comment: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
      min_distance: 2.50
    },
    {
      name: 'Dominic Toretto',
      description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      vehicle: 'Dodge Charger R/T 1970 modificado',
      review_rating: 4.0,
      review_comment: 'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
      min_distance: 5.00
    },
    {
      name: 'James Bond',
      description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      vehicle: 'Aston Martin DB5 clássico',
      review_rating: 5.0,
      review_comment: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
      min_distance: 10.00
    }
  ]);
}
