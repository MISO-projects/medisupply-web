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

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

### Servidor de desarrollo

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/` y se recargará automáticamente al modificar archivos.

### Build

Para construir el proyecto para producción:

```bash
ng build
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
