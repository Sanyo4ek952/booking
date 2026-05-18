# Reserve Calendar

Мини-приложение на React для публичного просмотра занятости 4 номеров и администрирования броней.

## Стек

- React 19.2.6
- TypeScript
- Vite 8.0.10
- Tailwind CSS 4.2.4
- React Router 7.15.0
- TanStack Query 5.100.9
- Supabase JS 2.105.3
- date-fns
- Radix UI
- lucide-react

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## Supabase

1. Создайте проект в Supabase.
2. Выполните SQL из файла `supabase.sql` в SQL Editor.
3. Включите Realtime для таблицы `bookings`, если публикация не была добавлена автоматически.
4. Создайте `.env` на основе `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_LOGIN=admin
VITE_ADMIN_PASSWORD=admin
```

Если env-переменные не заданы, приложение покажет понятное сообщение вместо падения.

## Маршруты

- `/` - публичная страница с календарем занятости.
- `/admin` - dashboard для создания, редактирования, удаления и фильтрации броней.

## PWA

Приложение содержит базовую installable PWA-конфигурацию для Vite:

- manifest доступен по `/manifest.webmanifest`;
- service worker доступен по `/sw.js` и регистрируется только в production-сборке;
- service worker кеширует shell приложения и безопасные статические ресурсы, но не кеширует API, auth-запросы и пользовательские данные;
- navigation request использует network-first стратегию с fallback на `/`.

Иконки в `public/icons` сейчас являются placeholder-ассетами. TODO: заменить их на финальные брендированные иконки перед production-релизом.

Проверка в Chrome DevTools:

1. Соберите и запустите production preview: `npm run build`, затем `npm run preview`.
2. Откройте Application -> Manifest и проверьте manifest, `start_url`, `scope` и иконки.
3. Откройте Application -> Service Workers и проверьте регистрацию `/sw.js`.
4. Запустите Lighthouse -> PWA/installability.

Полноценная установка PWA требует HTTPS или `localhost`.

## Архитектура

```text
src/app               провайдеры, роутинг, layout
src/pages             страницы приложения
src/features/bookings сценарии бронирования
src/entities/room     модель и список номеров
src/shared/api        Supabase client и запросы
src/shared/lib        общие функции
src/shared/ui         переиспользуемые UI-компоненты
```

## Важное

Для входа в админку используются `VITE_ADMIN_LOGIN` и `VITE_ADMIN_PASSWORD`. После успешного входа сессия сохраняется в `localStorage` текущего браузера и остаётся активной до ручного выхода.

Текущая авторизация защищает интерфейс админки на уровне клиента. Для production-доступа замените RLS-политики в `supabase.sql` на доступ только для authenticated/admin-пользователей и не полагайтесь только на frontend-проверку.
