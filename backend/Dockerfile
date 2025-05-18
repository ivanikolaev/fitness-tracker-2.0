# Базовый образ Node.js
FROM node:20-alpine as base

# Рабочая директория
WORKDIR /app

# Стадия разработки
FROM base as development
# Копирование всего проекта
COPY package*.json ./
# Установка зависимостей для разработки
RUN npm ci
COPY . .

# Открытие порта, который будет использоваться приложением
EXPOSE 3001
# Запуск в режиме разработки
CMD ["npm", "run", "dev"]