import { useReducer, useEffect, useCallback } from 'react';
import styles from './PanelLayout.module.css';

// --- MİNİ KUMANDA ---
// 1. Dosyanın en üstündeki Radix importlarına ihtiyacımız olanları ekleyelim:
import { Button, Flex } from '@radix-ui/themes';

// 2. MiniKumanda fonksiyonunu tamamen bu akıllı Radix yapısıyla değiştir:
function MiniKumanda({ state, dispatch }) {
  const areAllPanelsOpen = state.isLeftOpen && state.isRightOpen && state.isFooterOpen;
  return (
    // Flex kullanarak HTML bağımlılığını azaltıyoruz
    <Flex align="center" gap="2" className={styles.miniKumandaCustom}>
      
      <Button 
        // Hepsi açıkken kırmızı (red) olsun, biri bile kapalıyken temanın ana rengini (gray/accent) alsın
        color={areAllPanelsOpen ? "red" : "gray"} 
        
        // Hepsi açıkken içi boş (surface), kapalıyken içi dolu (solid) olsun
        variant={areAllPanelsOpen ? "surface" : "solid"} 
        size="2" 
        
        // Hepsi açıkken tıklanırsa CLOSE_ALL, biri bile kapalıyken tıklanırsa OPEN_ALL çalışsın
        onClick={() => dispatch({ type: areAllPanelsOpen ? 'CLOSE_ALL' : 'OPEN_ALL' })}
      >
        {/* Hepsi açıkken buton metni '💥 Hepsini Kapa', kapalıyken '🌐 Hepsini Aç' olsun */}
        {areAllPanelsOpen ? '💥 Tam Ekran' : '🌐 Slider Aç'}
      </Button>
      
      <span className={styles.divider}>|</span>

      

    </Flex>
  );
}

// --- REDUCER ALTYAPISI ---
const initialState = {
  isFooterOpen: true,
  isLeftOpen: true,
  isRightOpen: true,
  leftWidth: 260,
  rightWidth: 280,
  footerHeight: 60,
  activeResizer: null
};

function panelReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FOOTER': return { ...state, isFooterOpen: !state.isFooterOpen };
    case 'TOGGLE_LEFT': return { ...state, isLeftOpen: !state.isLeftOpen };
    case 'TOGGLE_RIGHT': return { ...state, isRightOpen: !state.isRightOpen };
    case 'SET_LEFT_WIDTH': return { ...state, leftWidth: action.payload };
    case 'SET_RIGHT_WIDTH': return { ...state, rightWidth: action.payload };
    case 'SET_FOOTER_HEIGHT': return { ...state, footerHeight: action.payload };
    case 'SET_ACTIVE_RESIZER': return { ...state, activeResizer: action.payload };
    case 'OPEN_ALL': return { ...initialState };
    case 'CLOSE_ALL':
      return {
        ...state,
        isLeftOpen: false,
        isRightOpen: false,
        isFooterOpen: false
      };
    default: return state;
  }
}

// --- ARTIK BURASI BİR TEMPLATE (ŞABLON) ---
export default function PanelLayout({ children, solPanelIcerik, sagPanelIcerik, logoIcerik, footerIcerik }) {
  const [state, dispatch] = useReducer(panelReducer, initialState);

  const startResize = useCallback((panel) => (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ACTIVE_RESIZER', payload: panel });
  }, []);

  useEffect(() => {
    if (!state.activeResizer) return;

    const resize = (e) => {
      if (state.activeResizer === 'left') {
        const newWidth = Math.min(Math.max(180, e.clientX), 500);
        dispatch({ type: 'SET_LEFT_WIDTH', payload: newWidth });
      } else if (state.activeResizer === 'right') {
        const newWidth = Math.min(Math.max(180, window.innerWidth - e.clientX), 500);
        dispatch({ type: 'SET_RIGHT_WIDTH', payload: newWidth });
      } else if (state.activeResizer === 'footer') {
        const newHeight = Math.min(Math.max(40, window.innerHeight - e.clientY), 300);
        dispatch({ type: 'SET_FOOTER_HEIGHT', payload: newHeight });
      }
    };

    const stopResize = () => dispatch({ type: 'SET_ACTIVE_RESIZER', payload: null });

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [state.activeResizer]);

  return (
    <div 
      className={`${styles.mainGrid} ${!state.isFooterOpen ? styles.hideFooter : ''}`}
      style={{
        display: 'grid',
        // Satır yükseklikleri burada yaşar: Üst Bar (50px), Orta Alan (Esnek 1fr), Footer (Dinamik)
        gridTemplateRows: `50px 1fr ${state.isFooterOpen ? state.footerHeight : 30}px`
      }}
    >
      {/* HEADER */}
      <header className={styles.headerBox}>
        <div>{logoIcerik || "💻 LOGO / PANEL"}</div>
        <MiniKumanda state={state} dispatch={dispatch} />
      </header>

      {/* ORTA ALAN */}
      <main 
        className={`${styles.middleGrid} 
          ${!state.isLeftOpen ? styles.hideLeft : ''} 
          ${!state.isRightOpen ? styles.hideRight : ''}
          ${state.activeResizer ? styles.noTransition : ''}`} 
        style={{
          gridTemplateColumns: `${state.isLeftOpen ? state.leftWidth : 40}px 1fr ${state.isRightOpen ? state.rightWidth : 40}px`
        }}
      >
        {/* SOL PANEL (Değişen Kısım: className doğrudan styles.leftPanel oldu) */}
        <aside className={styles.leftPanel}>
          {state.isLeftOpen ? (
            // PANEL AÇIKKEN: Normal içerik gösteriliyor
            <>
              <div style={{ width: '100%', height: '100%', padding: '10px', overflowY: 'auto' }}>
                {solPanelIcerik || "Sol İçerik Yok"}
              </div>
              <button 
                className={`${styles.toggleBtn} ${styles.closeInside}`} 
                onClick={() => dispatch({ type: 'TOGGLE_LEFT' })}
              >
                ◀
              </button>
              {state.isLeftOpen && <div className={styles.resizer} onMouseDown={startResize('left')} />}
            </>
          ) : (
            // PANEL KAPALIYKEN: Tüm aside alanını kaplayan dikey buton
            <button 
              className={styles.dikeyAcmaButonu} 
              onClick={() => dispatch({ type: 'TOGGLE_LEFT' })}
              title="Sol Paneli Aç"
            >
              ▶
            </button>
          )}
        </aside>

        {/* ANA İÇERİK ALANI (Aynen kalıyor) */}
        <section className={styles.contentArea}>
          <div style={{ width: '100%', height: '100%', padding: '20px', overflowY: 'auto' }}>
            {children}
          </div>
        </section>

        {/* SAĞ PANEL (Değişen Kısım: className doğrudan styles.rightPanel oldu) */}
        <aside className={styles.rightPanel}>
          {state.isRightOpen ? (
            <>
              <div style={{ width: '100%', height: '100%', padding: '10px', overflowY: 'auto' }}>
              {sagPanelIcerik || "Sağ İçerik Yok"}
            </div>
            <button className={`${styles.toggleBtn} ${styles.closeInside}`} onClick={() => dispatch({ type: 'TOGGLE_RIGHT' })}>▶</button>
            {state.isRightOpen && <div className={styles.resizerLeft} onMouseDown={startResize('right')} />}
            </>
          ):(
            <button 
              className={styles.dikeyAcmaButonu} 
              onClick={() => dispatch({ type: 'TOGGLE_RIGHT' })}
              title="Sağ Paneli Aç"
            >
              ◀
            </button>
          )}
          
        </aside>
      </main>

      {/* FOOTER */}
      <footer className={styles.footerBox} style={{ position: 'relative' }}>
        {state.isFooterOpen ? (
          // FOOTER AÇIKKEN
          <>
            {/* Üst kenara yerleşen yatay sürükleme çizgisi (Resizer) */}
            <div 
              className={styles.resizerTop} 
              onMouseDown={startResize('footer')} 
            />
            
            <div>{footerIcerik || "FOOTER (Alt Bar)"}</div>
            
            <button 
              className={styles.toggleBtn} 
              onClick={() => dispatch({ type: 'TOGGLE_FOOTER' })}
            >
              ▼ Kapat
            </button>
          </>
        ) : (
          // FOOTER KAPALIYKEN: Tüm alanı kaplayan yatay geniş buton
          <button 
            className={styles.yatayAcmaButonu} 
            onClick={() => dispatch({ type: 'TOGGLE_FOOTER' })}
            title="Footer'ı Aç"
          >
            ▲ Alt Barı Aç
          </button>
        )}
      </footer>
    </div>
  );
}