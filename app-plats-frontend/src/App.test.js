import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders Accueil component', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Remplace ce texte par un contenu réel de la page Accueil.js
  const accueilElement = screen.getByText(/Accueil/i);
  expect(accueilElement).toBeInTheDocument();
});
