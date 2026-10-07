# Urdi · Navegación

Prototipo navegable de la navegación de Urdi (sidebar, buscador ⌘K, asistente, tab bar mobile y sección de administración), construido con [ShadeUI](https://www.shadeui.dev) (`@shadeui/ui`).

Es la versión en React del wireframe `navegacion.html` del sprint de UX/UI.

## Correr local

```bash
pnpm install
pnpm dev
```

## Controles del prototipo

Arriba del marco hay tres selectores:

- **Vista**: Desktop o Mobile.
- **Usuario**: Nuevo (sin apps, el asistente toma el Inicio) o Con apps (tablero + botón flotante del asistente).
- **Rol**: Miembro o Admin (agrega la sección Administración).

## Estructura

```
src/
  App.tsx                 marco del prototipo, controles y estado global
  state.ts                tipos y contexto del prototipo
  data.ts                 apps, grupos y store de ejemplo
  pages/Pages.tsx         Inicio, Tus apps, Store, Grupos, Ajustes y Admin
  components/
    AppSidebar.tsx        sidebar desktop (ShadeUI Navigation)
    MobileChrome.tsx      header y tab bar mobile
    SearchDialog.tsx      buscador ⌘K de apps y grupos
    AssistantDrawer.tsx   panel del asistente (ShadeUI Drawer + Message)
    ui.tsx                piezas de layout (tiles, filas, placeholders)
```

## UI

Los controles vienen de `@shadeui/ui` (Navigation, Drawer, Message, ButtonGroup, DefaultInput, Bezel/Flat/Link buttons, Avatar). El layout usa Tailwind con los tokens semánticos de ShadeUI (`--shadeui-bg`, `--shadeui-fg`, `--shadeui-border`, …) mapeados en `src/index.css`. Ver `node_modules/@shadeui/ui/AGENTS.md` para las reglas del sistema.
