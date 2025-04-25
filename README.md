# BeautyGo

BeautyGo es una aplicación que conecta a profesionales de belleza con clientes, permitiendo descubrir, reservar y recibir servicios a domicilio.

## Características

- 🔍 Descubre profesionales de belleza cerca de ti
- 📅 Reserva citas fácilmente
- 🏠 Recibe servicios en la comodidad de tu hogar
- ⭐ Evalúa y revisa profesionales
- 💰 Pago seguro y transparente

## Tecnologías

- [Nuxt 3](https://nuxt.com/) - Framework Vue.js
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Pinia](https://pinia.vuejs.org/) - Gestión de estado
- [Mapbox](https://www.mapbox.com/) - Integración de mapas
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático

## Requisitos previos

- Node.js (v18 o superior)
- npm o yarn

## Instalación

1. Clona este repositorio
```bash
git clone https://github.com/usuario/beautygo.git
cd beautygo
```

2. Instala las dependencias
```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo
```bash
npm run dev
# o
yarn dev
```

4. Abre http://localhost:3000 en tu navegador

## Estructura del proyecto

```
beautygo/
├── assets/            # Recursos estáticos (imágenes, fuentes, etc.)
├── components/        # Componentes Vue
│   ├── auth/          # Componentes relacionados con autenticación
│   ├── home/          # Componentes para la página principal
│   ├── onboarding/    # Componentes para el onboarding
│   └── ui/            # Componentes de UI reutilizables
├── composables/       # Funciones composables
├── layouts/           # Layouts para las páginas
├── pages/             # Páginas de la aplicación
│   ├── auth/          # Páginas de autenticación
│   └── home/          # Páginas para usuarios autenticados
├── public/            # Archivos públicos
├── stores/            # Stores Pinia
└── types/             # Tipos TypeScript
```

## Flujo de la aplicación

1. **Splash Screen** - Pantalla de bienvenida
2. **Onboarding** - Introducción para nuevos usuarios
3. **Autenticación** - Login y registro
4. **Home** - Descubrir profesionales cercanos
5. **Perfil profesional** - Ver detalles y servicios
6. **Reserva** - Proceso de reserva de servicios
7. **Perfil de usuario** - Gestión de cuenta

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run generate` - Genera la versión estática de la aplicación
- `npm run preview` - Previsualiza la versión de producción
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Arregla automáticamente problemas de linting

## Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Realiza los cambios necesarios
4. Haz commit de tus cambios (`git commit -m 'Añade nueva característica'`)
5. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
6. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).
