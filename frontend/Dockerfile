# Базовый образ Node.js
FROM node:20-alpine as base

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Этап установки зависимостей
FROM base as dependencies
RUN npm ci

# Этап разработки
FROM dependencies as development
# Копирование всего кода проекта
COPY . .
# Expose порт для Vite dev server
EXPOSE 5173
# Запуск в режиме разработки
CMD ["npm", "run", "dev"]