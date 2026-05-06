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
```

Если env-переменные не заданы, приложение покажет понятное сообщение вместо падения.

## Маршруты

- `/` - публичная страница с календарем занятости.
- `/admin` - dashboard для создания, редактирования, удаления и фильтрации броней.

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

Админ-страница в этой версии не содержит авторизации и работает через anon key. Для production-доступа замените RLS-политики в `supabase.sql` на доступ только для authenticated/admin-пользователей.
