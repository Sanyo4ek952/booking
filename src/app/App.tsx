import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { RequireAdminAuth } from "@/features/auth/RequireAdminAuth";
import { AdminPage } from "@/pages/AdminPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { CreateRoomPage } from "@/pages/CreateRoomPage";
import { PublicPage } from "@/pages/PublicPage";
import { RoomDetailsPage } from "@/pages/RoomDetailsPage";
import { RoomsPage } from "@/pages/RoomsPage";
import { ToastProvider } from "@/shared/ui/Toast";
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
      { index: true, element: <Navigate to="/rooms" replace /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "rooms/:roomId", element: <RoomDetailsPage /> },
      { path: "admin/login", element: <AdminLoginPage /> },
      {
        element: <RequireAdminAuth />,
        children: [
          { path: "admin", element: <PublicPage /> },
          { path: "admin/bookings", element: <AdminPage /> },
          { path: "admin/rooms/new", element: <CreateRoomPage /> },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
