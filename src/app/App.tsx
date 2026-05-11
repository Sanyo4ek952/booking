import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastProvider } from "@/shared/ui/Toast";
import { AdminPage } from "@/pages/AdminPage";
import { CreateRoomPage } from "@/pages/CreateRoomPage";
import { PublicPage } from "@/pages/PublicPage";
import { RoomDetailsPage } from "@/pages/RoomDetailsPage";
import { RoomsPage } from "@/pages/RoomsPage";
import { RootLayout } from "./RootLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <PublicPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "rooms/:roomId", element: <RoomDetailsPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "admin/rooms/new", element: <CreateRoomPage /> },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
