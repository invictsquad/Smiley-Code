import React from 'react';
import { ChevronLeft, Check, Zap, Trophy, Rocket, Sparkles, Heart } from 'lucide-react';
import { Language } from '../types';
import { t } from '../lib/i18n';
import Header from './Header';
import Footer from './Footer';
import TrustedByCarousel from './TrustedByCarousel';
import { motion } from 'framer-motion';

interface PricingPageProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
    onBack: () => void;
    user?: any;
    onOpenAuth?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({
    language,
    onLanguageChange,
    onBack,
    user,
    onOpenAuth
}) => {
    const plans = [
        {
            name: 'Gratuito',
            price: 'R$ 0',
            period: '/mês',
            description: 'Perfeito para começar',
            icon: Heart,
            color: 'brand-green',
            features: [
                '5 projetos por mês',
                'Templates básicos',
                'Preview em tempo real',
                'Export de código',
                'Suporte da comunidade'
            ],
            limitations: [
                'Sem deploy automático',
                'Sem versionamento avançado',
                'Sem suporte prioritário'
            ]
        },
        {
            name: 'Pro',
            price: 'R$ 29',
            period: '/mês',
            description: 'Para desenvolvedores sérios',
            icon: Zap,
            color: 'brand-coral',
            popular: true,
            features: [
                'Projetos ilimitados',
                'Todos os templates',
                'Deploy automático',
                'Versionamento avançado',
                'Análise de código IA',
                'Suporte por email',
                'Domínio personalizado'
            ]
        },
        {
            name: 'Business',
            price: 'R$ 99',
            period: '/mês',
            description: 'Para equipes e empresas',
            icon: Trophy,
            color: 'brand-yellow',
            features: [
                'Tudo do plano Pro',
                'Colaboração em equipe',
                'Projetos privados ilimitados',
                'API personalizada',
                'Suporte prioritário',
                'Treinamento personalizado',
                'SLA garantido'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-brand-bg dark:bg-dark-bg">
            <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_101%,#f8731e_0%,#f36ea5_30%,#418ce1_55%,#ffffff_75%)] dark:bg-[radial-gradient(125%_125%_at_50%_101%,#f8731e66_0%,#f36ea555_30%,#418ce144_55%,transparent_75%)]"></div>

            <Header
                language={language}
                onLanguageChange={onLanguageChange}
                user={user}
                onOpenAuth={onOpenAuth}
            />

            <div className="relative max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 mb-8 text-white hover:text-brand-yellow transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span className="font-bold">Voltar</span>
                </button>

                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl md:text-6xl text-white dark:text-dark-text tracking-tighter [text-shadow:4px_4px_0px_#1e293b] dark:[text-shadow:4px_4px_0px_rgba(0,0,0,0.3)] mb-4">
                        Preços Simples
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 dark:text-slate-300 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] max-w-2xl mx-auto">
                        Escolha o plano perfeito para suas necessidades. Comece grátis e evolua conforme cresce.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-6 shadow-comic dark:shadow-comic-dark ${plan.popular ? 'ring-4 ring-brand-coral ring-offset-4 ring-offset-brand-bg dark:ring-offset-dark-bg' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-brand-coral text-slate-800 px-4 py-1 rounded-full text-sm font-bold border-2 border-slate-800 flex items-center gap-1">
                                            <Sparkles size={14} />
                                            Mais Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-${plan.color} border-2 border-slate-800 dark:border-dark-border rounded-lg mb-4`}>
                                        <Icon size={32} className="text-slate-800" />
                                    </div>
                                    <h3 className="font-display text-2xl text-slate-800 dark:text-dark-text mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="font-display text-4xl text-slate-800 dark:text-dark-text">
                                            {plan.price}
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {plan.period}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-5 h-5 bg-brand-green border border-slate-800 rounded-full flex items-center justify-center">
                                                <Check size={12} className="text-slate-800" />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}

                                    {plan.limitations && plan.limitations.map((limitation, idx) => (
                                        <div key={idx} className="flex items-center gap-3 opacity-60">
                                            <div className="flex-shrink-0 w-5 h-5 bg-slate-300 border border-slate-800 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-slate-600">✕</span>
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-400 line-through">
                                                {limitation}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-3 px-4 rounded-lg border-2 border-slate-800 font-bold text-slate-800 transition-colors ${plan.popular
                                        ? 'bg-brand-coral hover:bg-brand-yellow shadow-comic-sm'
                                        : 'bg-white dark:bg-dark-surface hover:bg-brand-teal/20 shadow-comic-sm'
                                        }`}
                                >
                                    {plan.name === 'Gratuito' ? 'Começar Grátis' : 'Escolher Plano'}
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-6 md:p-8 shadow-comic dark:shadow-comic-dark mb-8">
                    <h2 className="font-display text-2xl md:text-3xl text-slate-800 dark:text-dark-text mb-6 text-center">
                        Perguntas Frequentes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-dark-text mb-2">
                                Posso cancelar a qualquer momento?
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Sim! Você pode cancelar seu plano a qualquer momento. Não há taxas de cancelamento.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-dark-text mb-2">
                                O que acontece com meus projetos se eu cancelar?
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Seus projetos permanecem acessíveis por 30 dias após o cancelamento para download.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-dark-text mb-2">
                                Há desconto para estudantes?
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Sim! Estudantes têm 50% de desconto em todos os planos pagos. Entre em contato conosco.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-dark-text mb-2">
                                Posso mudar de plano depois?
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="bg-brand-green/20 border-2 border-brand-green rounded-lg p-6 inline-block">
                        <Rocket size={32} className="text-brand-teal mx-auto mb-3" />
                        <h3 className="font-display text-xl text-slate-800 dark:text-dark-text mb-2">
                            Precisa de algo personalizado?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Entre em contato para planos empresariais e soluções customizadas.
                        </p>
                        <a
                            href="mailto:sales@smileycode.com.br"
                            className="inline-flex items-center gap-2 bg-brand-teal text-white px-4 py-2 rounded-lg border-2 border-slate-800 font-bold hover:bg-brand-coral transition-colors"
                        >
                            Falar com Vendas
                        </a>
                    </div>
                </div>
            </div>

            <TrustedByCarousel language={language} />
            <Footer language={language} />
        </div>
    );
};

export default PricingPage;