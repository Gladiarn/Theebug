import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { LandingPage } from './components/LandingPage';
import { GamePage } from './components/GamePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: 'play', Component: GamePage },
    ],
  },
]);
