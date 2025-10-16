import React from 'react';
import { Language } from '../types';

interface TrustedByCarouselProps {
    language: Language;
}

const TrustedByCarousel: React.FC<TrustedByCarouselProps> = ({ language }) => {
    // Marcas famosas que "confiam" no projeto (simuladas para demonstração)
    const brands = [
        {
            name: 'Microsoft',
            logo: 'https://img.icons8.com/color/96/microsoft.png',
            alt: 'Microsoft'
        },
        {
            name: 'Google',
            logo: 'https://img.icons8.com/color/96/google-logo.png',
            alt: 'Google'
        },
        {
            name: 'Amazon',
            logo: 'https://img.icons8.com/color/96/amazon.png',
            alt: 'Amazon'
        },
        {
            name: 'Netflix',
            logo: 'https://img.icons8.com/color/96/netflix.png',
            alt: 'Netflix'
        },
        {
            name: 'Spotify',
            logo: 'https://img.icons8.com/color/96/spotify.png',
            alt: 'Spotify'
        },
        {
            name: 'Vercel',
            logo: 'https://img.icons8.com/color/96/vercel.png',
            alt: 'Vercel'
        },
        {
            name: 'Airbnb',
            logo: 'https://img.icons8.com/color/96/airbnb.png',
            alt: 'Airbnb'
        },
        {
            name: 'Tesla',
            logo: 'https://img.icons8.com/color/96/tesla.png',
            alt: 'Tesla'
        },
        {
            name: 'Apple',
            logo: 'https://img.icons8.com/color/96/mac-os.png',
            alt: 'Apple'
        },
        {
            name: 'Meta',
            logo: 'https://img.icons8.com/color/96/meta.png',
            alt: 'Meta'
        },
        {
            name: 'Adobe',
            logo: 'https://img.icons8.com/color/96/adobe-creative-cloud.png',
            alt: 'Adobe'
        },
        {
            name: 'Slack',
            logo: 'https://img.icons8.com/color/96/slack-new.png',
            alt: 'Slack'
        },
        {
            name: 'GitHub',
            logo: 'https://img.icons8.com/color/96/github.png',
            alt: 'GitHub'
        },
        {
            name: 'Discord',
            logo: 'https://img.icons8.com/color/96/discord-logo.png',
            alt: 'Discord'
        },
        {
            name: 'Zoom',
            logo: 'https://img.icons8.com/color/96/zoom.png',
            alt: 'Zoom'
        },
        {
            name: 'Dropbox',
            logo: 'https://img.icons8.com/color/96/dropbox.png',
            alt: 'Dropbox'
        }
    ];

    const title = {
        pt: 'Empresas que confiam no Smiley Code',
        en: 'Companies that trust Smiley Code',
        es: 'Empresas que confían en Smiley Code'
    };

    return (
        <div className="bg-white/30 dark:bg-dark-surface/30 backdrop-blur-sm border-t-2 border-slate-800 dark:border-dark-border py-8 md:py-12 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-center text-slate-800 dark:text-dark-text mb-2">
                    {title[language]}
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-400 text-sm md:text-base mb-2">
                    {language === 'pt' && 'Mais de 10.000 desenvolvedores já criaram projetos incríveis'}
                    {language === 'en' && 'Over 10,000 developers have already created amazing projects'}
                    {language === 'es' && 'Más de 10,000 desarrolladores ya han creado proyectos increíbles'}
                </p>
                <p className="text-center text-slate-500 dark:text-slate-500 text-xs">
                    {language === 'pt' && '* Logos utilizados apenas para fins demonstrativos'}
                    {language === 'en' && '* Logos used for demonstration purposes only'}
                    {language === 'es' && '* Logos utilizados solo con fines demostrativos'}
                </p>
            </div>

            {/* Carrossel com rolagem infinita */}
            <div className="relative overflow-hidden">
                <div className="brands-scroll-test">
                    {/* Primeira sequência de logos */}
                    {brands.map((brand, index) => (
                        <div
                            key={`first-${index}`}
                            className="flex-shrink-0 mx-4 md:mx-6"
                        >
                            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-3 md:p-4 shadow-comic-sm hover:shadow-comic transition-all duration-300 hover:-translate-y-1 hover:scale-105 group cursor-pointer">
                                <img
                                    src={brand.logo}
                                    alt={brand.alt}
                                    className="w-12 h-12 md:w-14 md:h-14 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                                    loading="lazy"
                                    onError={(e) => {
                                        // Fallback para ícone genérico se a imagem não carregar
                                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`;
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Segunda sequência de logos (duplicada para loop infinito) */}
                    {brands.map((brand, index) => (
                        <div
                            key={`second-${index}`}
                            className="flex-shrink-0 mx-4 md:mx-6"
                        >
                            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-3 md:p-4 shadow-comic-sm hover:shadow-comic transition-all duration-300 hover:-translate-y-1 hover:scale-105 group cursor-pointer">
                                <img
                                    src={brand.logo}
                                    alt={brand.alt}
                                    className="w-12 h-12 md:w-14 md:h-14 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`;
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gradientes nas bordas para efeito de fade */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#fdfaf4] dark:from-[#1e293b] to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#fdfaf4] dark:from-[#1e293b] to-transparent pointer-events-none z-10"></div>
            </div>
        </div>
    );
};

export default TrustedByCarousel;