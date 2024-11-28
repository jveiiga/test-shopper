# Usar a imagem base do Node.js
FROM node:14

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Compilar a aplicação React
RUN npm run build

# Instalar serve para servir a aplicação compilada
RUN npm install -g serve

# Expor a porta que o serve irá usar
EXPOSE 80

# Comando para servir a aplicação
CMD ["serve", "-s", "build"]

