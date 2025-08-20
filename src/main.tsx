//import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from "./App";

// Function to remove scrollbars from all elements
const removeScrollbars = () => {
  const style = document.createElement('style');
  style.textContent = `
    * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    *::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none !important;
    }
    *::-webkit-scrollbar-track {
      display: none !important;
    }
    *::-webkit-scrollbar-thumb {
      display: none !important;
    }
    *::-webkit-scrollbar-corner {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Remove scrollbars immediately
removeScrollbars();

// Also remove scrollbars after DOM is loaded
document.addEventListener('DOMContentLoaded', removeScrollbars);

// Remove scrollbars periodically to catch dynamically created elements
setInterval(removeScrollbars, 1000);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
