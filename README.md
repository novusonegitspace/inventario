# AssetLens Rebuild

Next.js rebuild de AssetLens con Prisma y SQL Server.

## Desarrollo local

1. Copie el archivo de entorno:

```bash
cp .env.example .env
```

2. Levante SQL Server en Docker:

```bash
npm run db:up
```

3. Ejecute la migración inicial:

```bash
npm run db:migrate:dev -- --name init
```

4. Inicie la app:

```bash
npm run dev
```

## Comandos útiles

```bash
npm run db:logs
npm run db:down
npm run db:generate
npm run db:validate
npm run lint
npm run build
```

## Notas de Docker

- La base local usa `mcr.microsoft.com/mssql/server:2022-latest`.
- El compose fija `platform: linux/amd64`.
- En Apple Silicon esto normalmente depende de emulación de Docker Desktop. Microsoft documenta soporte de contenedores SQL Server para x86-64 Linux; entornos de emulación no están testeados ni soportados oficialmente.
