import React from 'react';
import { ChevronLeft, FileText, Users, AlertTriangle, Scale, Hammer } from 'lucide-react';
import { Language } from '../types';
import { t } from '../lib/i18n';
import Header from './Header';
import Footer from './Footer';
import TrustedByCarousel from './TrustedByCarousel';

interface TermsOfServicePageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  user?: any;
  onOpenAuth?: () => void;
}

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ 
  language, 
  onLanguageChange, 
  onBack, 
  user, 
  onOpenAuth 
}) => {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg">
      <Header 
        language={language} 
        onLanguageChange={onLanguageChange} 
        user={user} 
        onOpenAuth={onOpenAuth} 
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-brand-teal hover:text-brand-coral transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold">Voltar</span>
        </button>

        <div className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-6 md:p-8 shadow-comic dark:shadow-comic-dark">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-brand-yellow p-3 border-2 border-slate-800 dark:border-dark-border rounded-lg">
              <FileText size={32} className="text-slate-800" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-slate-800 dark:text-dark-text">
              Termos de Serviço
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  1. Aceitação dos Termos
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  Ao usar o Smiley Code, você concorda com estes termos de serviço. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                </p>
                <p>
                  Estes termos se aplicam a todos os usuários da plataforma, incluindo visitantes, 
                  usuários registrados e desenvolvedores.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  2. Descrição do Serviço
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  O Smiley Code é uma plataforma de desenvolvimento web assistido por IA que permite:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criar aplicações web através de conversas com IA</li>
                  <li>Editar e visualizar código em tempo real</li>
                  <li>Fazer deploy de aplicações</li>
                  <li>Colaborar em projetos</li>
                  <li>Usar templates pré-construídos</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-brand-coral" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  3. Uso Aceitável
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>Você concorda em NÃO usar o Smiley Code para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criar conteúdo ilegal, prejudicial ou ofensivo</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Distribuir malware ou código malicioso</li>
                  <li>Fazer engenharia reversa da plataforma</li>
                  <li>Sobrecarregar nossos servidores</li>
                  <li>Criar contas falsas ou múltiplas</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Hammer size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  4. Propriedade Intelectual
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div className="bg-brand-green/20 border-2 border-brand-green rounded-lg p-4">
                  <h3 className="font-bold text-slate-800 dark:text-dark-text mb-2">
                    Seus Projetos
                  </h3>
                  <p>
                    Você mantém todos os direitos sobre o código e conteúdo que criar usando o Smiley Code. 
                    Nós não reivindicamos propriedade sobre seus projetos.
                  </p>
                </div>
                
                <div className="bg-brand-yellow/20 border-2 border-brand-yellow rounded-lg p-4">
                  <h3 className="font-bold text-slate-800 dark:text-dark-text mb-2">
                    Nossa Plataforma
                  </h3>
                  <p>
                    O Smiley Code, incluindo seu código-fonte, design e funcionalidades, 
                    é propriedade de Luiz Antônio De Lima Mendonça e está protegido por direitos autorais.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text mb-4">
                5. Limitação de Responsabilidade
              </h2>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  O Smiley Code é fornecido "como está". Não garantimos que o serviço será 
                  ininterrupto ou livre de erros. Não somos responsáveis por:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Perda de dados ou projetos</li>
                  <li>Interrupções do serviço</li>
                  <li>Problemas com código gerado pela IA</li>
                  <li>Danos indiretos ou consequenciais</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text mb-4">
                6. Modificações dos Termos
              </h2>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  Podemos modificar estes termos a qualquer momento. Notificaremos sobre 
                  mudanças significativas por email ou através da plataforma.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text mb-4">
                7. Contato
              </h2>
              <div className="bg-brand-teal/20 border-2 border-brand-teal rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  Para questões sobre estes termos:
                </p>
                <p className="font-bold text-slate-800 dark:text-dark-text mt-2">
                  📧 Email: legal@smileycode.com.br<br />
                  📍 Resende, Rio de Janeiro, Brasil<br />
                  👤 Responsável: Luiz Antônio De Lima Mendonça
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <TrustedByCarousel language={language} />
      <Footer language={language} />
    </div>
  );
};

export default TermsOfServicePage;