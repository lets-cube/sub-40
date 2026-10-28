import { createRoot } from 'react-dom/client';

import App from './App';

import './styles/base.css';
import './styles/fonts.css';
import './styles/theme.css';
import './styles/react.css';

createRoot(document.getElementById('root')!).render(<App />);
