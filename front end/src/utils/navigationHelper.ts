// This file lets non-React files (like axiosInstance)
// trigger navigation inside React

// ─────────────────────────────────────────
// HOW IT WORKS:
// axiosInstance fires a custom event "navigate"
// App.tsx listens for that event
// App.tsx uses React Router to navigate safely
// ─────────────────────────────────────────

// Fire a navigation event from anywhere in your app
// utils/navigationHelper.ts

export const navigateTo = (path: string) => {
  // Use native browser navigation instead of a React hook!
  window.location.href = path;
};
