import { useState, useEffect } from 'react';
import './fontCustomizer.css';

const FONT_THEMES = [
  { name: 'Tech Industrial', headline: 'Space Grotesk', body: 'Manrope' },
  { name: 'Premium Tech', headline: 'Outfit', body: 'Plus Jakarta Sans' },
  { name: 'Vanguardista', headline: 'Syne', body: 'Hanken Grotesk' },
  { name: 'Neo-Minimalista', headline: 'Urbanist', body: 'Figtree' },
  { name: 'High Performance', headline: 'Sora', body: 'Be Vietnam Pro' },
  { name: 'Geométrica', headline: 'Readex Pro', body: 'Lexend' },
  { name: 'Neo-Modernista', headline: 'Bricolage Grotesque', body: 'Onest' },
  { name: 'Nordic Tech', headline: 'Schibsted Grotesk', body: 'DM Sans' },
  { name: 'Friendly Geometric', headline: 'Jost', body: 'Quicksand' },
  { name: 'Technical Archive', headline: 'Archivo', body: 'Inter' },
  { name: 'Cyber-Mono', headline: 'Space Mono', body: 'Sora' },
  { name: 'Soft Tech', headline: 'Montserrat', body: 'Plus Jakarta Sans' },
  { name: 'Academic Modern', headline: 'Epilogue', body: 'Public Sans' },
];

function FontCustomizer() {
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('mc_font_theme_idx');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const theme = FONT_THEMES[activeTheme];
    document.documentElement.style.setProperty('--font-family-headline', `'${theme.headline}', sans-serif`);
    document.documentElement.style.setProperty('--font-family-body', `'${theme.body}', sans-serif`);
    localStorage.setItem('mc_font_theme_idx', activeTheme);
  }, [activeTheme]);

  return (
    <div className={`font-customizer ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="font-customizer__fab" 
        onClick={() => setIsOpen(!isOpen)}
        title="Personalizar Tipografía"
      >
        Aa
      </button>

      <div className="font-customizer__panel">
        <div className="font-customizer__header">
          <h3>Temas de Tipografía (2026)</h3>
          <p>Prueba cómo cambia el estilo en vivo</p>
        </div>
        
        <div className="font-customizer__list">
          {FONT_THEMES.map((theme, index) => (
            <button
              key={theme.name}
              className={`font-customizer__option ${activeTheme === index ? 'is-active' : ''}`}
              onClick={() => setActiveTheme(index)}
            >
              <span className="theme-name">{theme.name}</span>
              <span className="theme-details">{theme.headline} / {theme.body}</span>
            </button>
          ))}
        </div>

        <div className="font-customizer__footer">
          Personaliza tu experiencia visual
        </div>
      </div>
    </div>
  );
}

export default FontCustomizer;
