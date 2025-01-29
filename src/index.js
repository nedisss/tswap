import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router } from 'react-router-dom';  // Importuojame BrowserRouter

// Sukuriame root elementą ir apgaubiame App komponentą su Router
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>  {/* Apgaubiame visą App su BrowserRouter */}
      <App />
    </Router>
  </Provider>
);

// Jei norite pradėti matuoti našumą savo programoje, perduokite funkciją
// log rezultatams (pavyzdžiui: reportWebVitals(console.log))
// arba siųskite į analitikos galinį tašką. Sužinokite daugiau: https://bit.ly/CRA-vitals
reportWebVitals();
