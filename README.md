# MediSupply Web

Aplicación web desarrollada en Angular, destinada a los equipos administrativos y operativos de MediSupply. Permite gestionar proveedores, productos, inventarios, pedidos y rutas logísticas, así como generar reportes e indicadores para la toma de decisiones.

## Características principales

- Gestión de proveedores y productos
- Control de inventarios
- Administración de pedidos
- Planificación de rutas logísticas
- Generación de reportes e indicadores
- Interfaz optimizada para equipos administrativos y operativos

## Tecnologías

- Angular 20.3.2
- TypeScript
- Componentes standalone
- Angular Signals para gestión de estado

## Desarrollo

### Requisitos previos

- Node.js (versión 20 o superior)
- npm o yarn
- Angular CLI

### Instalación

#### Opción 1: Usando Docker (Recomendado)

1. Clonar el repositorio
2. Asegurarse de tener Docker y Docker Compose instalados
3. Levantar el ambiente de desarrollo:
```bash
docker-compose up
```

La aplicación estará disponible en `http://localhost:4200/`

**Comandos útiles:**
```bash
# Reconstruir después de cambios en dependencias
docker-compose up --build

# Detener el contenedor
docker-compose down

# Ver logs
docker-compose logs -f
```

#### Opción 2: Instalación tradicional

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

### Servidor de desarrollo

#### Sin Docker

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

#### Con Docker

```bash
docker-compose up
```

La aplicación estará disponible en `http://localhost:4200/` y se recargará automáticamente al modificar archivos.

### Build

#### Build de desarrollo

```bash
ng build
```

#### Build de producción

```bash
npm run build:prod
```

Los archivos generados se guardarán en el directorio `dist/`.

### Testing

Ejecutar pruebas unitarias:
```bash
ng test
```

Ejecutar pruebas end to end:
```bash
ng e2e
```

### Estructura del proyecto

```
src/
├── app/
│   ├── components/    # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── services/      # Servicios y lógica de negocio
│   ├── models/        # Interfaces y tipos
│   └── shared/        # Utilidades compartidas
├── assets/            # Recursos estáticos
└── environments/      # Configuración de entornos
```

### Convenciones de desarrollo

- Usar componentes standalone
- Implementar Angular Signals para manejo de estado
- Seguir las guías de estilo de Angular
- Usar TypeScript con tipado estricto
