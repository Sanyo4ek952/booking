import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastProvider } from "@/shared/ui/Toast";
import { AdminPage } from "@/pages/AdminPage";
import { PublicPage } from "@/pages/PublicPage";
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
      { path: "admin", element: <AdminPage /> },
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
