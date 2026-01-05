## GUIA DE INSTALACION

1. Clonar el repositorio
2. Crear una copia del `.env.template` y renombrarlo a `.env` y cambiar las variables de entorno
3. Instalar dependencias `npm install`
4. Levantar la base de datos `docker compose up -d`
5. Correr las migraciones de prisma `npx prisma migrate dev --name init`
6. Generar cliente de prisma `npx prisma generate`
7. Ejecutar seed `npm run seed`
8. Correr el proyecto `npm run dev`
