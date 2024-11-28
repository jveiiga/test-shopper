# Usar a imagem base do Node.js
FROM node:14

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que o app vai rodar
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["npm", "start"]
