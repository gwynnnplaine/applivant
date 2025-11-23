export const ROUTES = {
  HOME: "/",
  ADD_APPLICATION: "/applications/new",
  EDIT_APPLICATION: (id: string) => `/applications/edit/${id}/`,
  VIEW_APPLICATION: (id: string) => `/applications/view/${id}`,
} as const;
