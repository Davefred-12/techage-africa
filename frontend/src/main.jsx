import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../src/context/authContext.jsx'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS with smooth animations
AOS.init({
  duration: 1000, // Animation duration (1 second)
  once: false, // Animate every time element comes into view
  offset: 120, // Start animation 120px before element is in view
  easing: 'ease-in-out', // Smooth easing
  delay: 0, // No default delay
  mirror: true, // Animate on scrolling up AND down
  anchorPlacement: 'top-bottom', // When to trigger animation
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)