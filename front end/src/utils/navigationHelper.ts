// This file lets non-React files (like axiosInstance)
// trigger navigation inside React

// ─────────────────────────────────────────
// HOW IT WORKS:
// axiosInstance fires a custom event "navigate"
// App.tsx listens for that event
// App.tsx uses React Router to navigate safely
// ─────────────────────────────────────────

// Fire a navigation event from anywhere in your app
export const navigateTo = (path: string) => {
  // Create a custom browser event with the path
  const event = new CustomEvent("navigate", {
    detail: { path }, // pass the path we want to go to
  });

  // Dispatch it on the window so App.tsx can listen
  window.dispatchEvent(event);
};
