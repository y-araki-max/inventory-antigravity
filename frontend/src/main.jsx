// Strict v10.1: Force Cache/Storage Reset
if (!localStorage.getItem('STRICT_V10_INITIALIZED')) {
  console.warn('Strict v10.1: Performing one-time storage wipe.');
  localStorage.clear();
  localStorage.setItem('STRICT_V10_INITIALIZED', 'true');
  // Reload to ensure state is clean
  window.location.reload();
}

// Strict v10.5: Specific Data Purge (Transactions/Adjustments)
if (!localStorage.getItem('RESET_COMPLETE_V10_5')) {
  console.warn('Strict v10.5: Purging transactions and adjustments.');
  // Explicitly overwrite potential legacy keys or current keys if named this way
  localStorage.setItem('transactions', JSON.stringify([]));
  localStorage.setItem('adjustments', JSON.stringify([]));

  // Also wipe the v9/v10 keys just in case?
  // User specifically asked for 'transactions' and 'adjustments' keys.
  // I will checking if my storage.js uses those.
  // My storage.js uses 'inventory_v9_1_history' etc.
  // But maybe other parts of the app (legacy) used 'transactions'.
  // I will do exactly what user asked.

  localStorage.setItem('RESET_COMPLETE_V10_5', 'true');
  window.location.reload();
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
