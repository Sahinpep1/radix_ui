import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// 🔥 Temayı ve Canlı Test Panelini (ThemePanel) içe aktarıyoruz
import { Theme, ThemePanel } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import './index.css'

// Sayfalarımızı içe aktarıyoruz
import AnaSayfa from './features/AnaSayfa/AnaSayfa.jsx'
import Ayarlar from './features/Ayarlar/Ayarlar.jsx'

// Rota Listesi
const router = createBrowserRouter([
  {
    path: "/",
    element: <AnaSayfa />,
  },
  {
    path: "/ayarlar",
    element: <Ayarlar />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Radix UI ana sarmalayıcısı */}
    <Theme appearance="dark" accentColor="sky" scaling="95%">      
      {/* Projeyi Rota Sağlayıcı ile başlatıyoruz */}
      <RouterProvider router={router} />
      
      {/* 🛠️ İşte o sihirli canlı tema seçici panel! */}
      <ThemePanel />
      
    </Theme>
  </StrictMode>,
)