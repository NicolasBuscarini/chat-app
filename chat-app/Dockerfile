# Etapa 1: Construção da aplicação
FROM node:18 AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de pacote e instalar dependências
COPY package.json package-lock.json ./
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Servir a aplicação
FROM nginx:alpine

# Copiar os arquivos de build para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta que o Nginx irá usar
EXPOSE 80

# Comando padrão para executar o Nginx
CMD ["nginx", "-g", "daemon off;"]
