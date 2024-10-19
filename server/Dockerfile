# Usa uma imagem base oficial do Node.js
FROM node:16

# Cria o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

EXPOSE 3003

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
