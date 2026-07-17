# Deploy En Azure

## Arquitectura recomendada

- `Azure App Service` para la app `Next.js`
- `Azure SQL Database` para la base de datos `SQL Server`
- `Application Insights` opcional para logs y monitoreo
- `Azure Storage` opcional más adelante para archivos de evidencia

No necesita separar frontend y backend ahora. Esta app funciona bien como monolito:

- UI en `Next.js`
- server rendering / server actions en el mismo proyecto
- acceso a datos con `Prisma`

La separación real en Azure es:

- `App Service`: corre la aplicación
- `Azure SQL`: guarda los datos

## 1. Crear Azure SQL Database

En el portal de Azure:

1. Crear un `Resource Group`
2. Crear `Azure SQL Database`
3. Crear un `SQL Server` lógico nuevo si Azure lo pide
4. Guardar estos datos:
   - nombre del servidor
   - nombre de la base
   - usuario admin
   - contraseña

Use la misma región para la base y la app.

## 2. Configurar acceso

En el `SQL Server` lógico:

1. Ir a `Networking`
2. Habilitar `Public network access` para el arranque inicial
3. Agregar su IP local para poder ejecutar migraciones desde su máquina
4. Para simplificar la primera subida, habilitar `Allow Azure services and resources to access this server`

Más adelante puede cerrar eso y pasar a una configuración más estricta.

## 3. Construir DATABASE_URL

Use este formato:

```env
DATABASE_URL="sqlserver://TU_SERVIDOR.database.windows.net:1433;database=TU_BASE;user=TU_USUARIO;password={TU_PASSWORD};encrypt=true;trustServerCertificate=false;schema=dbo"
```

Si la contraseña tiene caracteres especiales, manténgala entre llaves `{}`.

## 4. Aplicar migraciones a Azure SQL

Desde su máquina local, apunte temporalmente `.env` a Azure SQL y ejecute:

```bash
npx prisma migrate deploy
```

Si quiere revisar el estado:

```bash
npx prisma migrate status
```

## 5. Subir el código a GitHub

Azure App Service trabaja más simple si el proyecto está en GitHub.

## 6. Crear App Service

En Azure Portal:

1. Crear `Web App`
2. `Publish`: `Code`
3. `Runtime stack`: `Node 22 LTS` o `Node 24 LTS` si aparece disponible en su portal
4. `Operating System`: `Linux`
5. Elegir la misma región del SQL
6. Elegir un plan `Basic` o superior si va a probar SSR de forma seria

## 7. Preparar GitHub Actions

El repositorio ya quedó preparado con este workflow:

[`deploy-azure-webapp.yml`](/Users/joseeduardorodriguesgodinho/Documents/inventarioNovusOne/inventarionovusone/.github/workflows/deploy-azure-webapp.yml)

Por defecto usa este nombre de Web App:

```yaml
AZURE_WEBAPP_NAME: inventarionovusone-app
```

Si su Web App se llama distinto, cambie ese valor en el workflow.

## 8. Descargar el publish profile

En la Web App:

1. Ir a `Overview`
2. Seleccionar `Get publish profile`
3. Descargar el archivo `.PublishSettings`

## 9. Crear el secret en GitHub

En GitHub:

1. `Settings` -> `Secrets and variables` -> `Actions`
2. `New repository secret`
3. Nombre:

```env
AZURE_WEBAPP_PUBLISH_PROFILE
```

4. Pegar el contenido completo del archivo `.PublishSettings`

## 10. Variables de entorno en App Service

En la Web App:

1. Ir a `Settings` -> `Environment variables`
2. Crear:

```env
DATABASE_URL=sqlserver://TU_SERVIDOR.database.windows.net:1433;database=TU_BASE;user=TU_USUARIO;password={TU_PASSWORD};encrypt=true;trustServerCertificate=false;schema=dbo
NODE_ENV=production
```

Si necesita sesión o futuras claves, agréguelas ahí también.

## 11. Startup command

En `Configuration` o `General settings`, use este comando:

```bash
npm run start:azure
```

Ese script ya quedó preparado para:

- ejecutar `prisma migrate deploy`
- arrancar `Next.js` en el `PORT` que Azure entrega

## 12. Hacer el primer deploy

Suba estos cambios a la rama `main`.

Cuando GitHub reciba el push:

1. instalará dependencias
2. generará Prisma Client
3. correrá `lint`
4. compilará `Next.js`
5. publicará un paquete listo para runtime con `.next`, `node_modules` y `prisma`
6. desplegará a Azure App Service

## 13. Alternativa con Deployment Center

También puede conectarlo desde Azure:

1. Ir a `Deployment Center`
2. Elegir `GitHub`
3. Autorizar la cuenta
4. Elegir repo y rama
5. Guardar

Azure puede generar un workflow automáticamente, pero es mejor mantener el archivo en el repo para controlar el proceso.

## 14. Validar despliegue

Después del primer deploy:

1. Abrir `Actions` en GitHub
2. Confirmar que el workflow termine en verde
3. Abrir la URL pública del App Service
4. Revisar `Log stream` en Azure si algo falla

## 15. Comandos útiles

Ver runtimes Linux disponibles:

```bash
az webapp list-runtimes --os linux | grep NODE
```

Forzar Node 22 en una Web App existente:

```bash
az webapp config set \
  --resource-group TU_RESOURCE_GROUP \
  --name TU_WEBAPP \
  --linux-fx-version "NODE|22-lts"
```

## Notas importantes

- `localhost` nunca sirve en Azure para la base de datos
- `Docker local` solo sirve para desarrollo
- este workflow despliega el runtime ya construido, así evita depender del build automático de Azure
- la evidencia todavía usa un `blobPath` local lógico; si quiere archivos reales en nube, el siguiente paso es `Azure Blob Storage`
