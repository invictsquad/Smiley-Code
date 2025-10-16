import React from 'react';
import { ChevronLeft, Shield, Eye, Database, Lock, Mail } from 'lucide-react';
import { Language } from '../types';
import { t } from '../lib/i18n';
import Header from './Header';
import Footer from './Footer';
import TrustedByCarousel from './TrustedByCarousel';

interface PrivacyPolicyPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  user?: any;
  onOpenAuth?: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ 
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
            <div className="bg-brand-green p-3 border-2 border-slate-800 dark:border-dark-border rounded-lg">
              <Shield size={32} className="text-slate-800" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-slate-800 dark:text-dark-text">
              Política de Privacidade
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  1. Informações que Coletamos
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  O Smiley Code coleta apenas as informações essenciais para fornecer nossos serviços:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Informações de Conta:</strong> Email e nome de usuário quando você se registra</li>
                  <li><strong>Projetos:</strong> Código e configurações dos projetos que você cria</li>
                  <li><strong>Dados de Uso:</strong> Como você interage com nossa plataforma (anonimizados)</li>
                  <li><strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Database size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  2. Como Usamos suas Informações
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Salvar e sincronizar seus projetos</li>
                  <li>Personalizar sua experiência</li>
                  <li>Comunicar atualizações importantes</li>
                  <li>Garantir a segurança da plataforma</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  3. Proteção de Dados
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  Levamos a segurança dos seus dados muito a sério:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Acesso restrito apenas a pessoal autorizado</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares e seguros</li>
                  <li>Conformidade com LGPD e GDPR</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={24} className="text-brand-teal" />
                <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
                  4. Seus Direitos
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>Você tem o direito de:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Portabilidade dos seus dados</li>
                  <li>Retirar consentimento a qualquer momento</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text mb-4">
                5. Contato
              </h2>
              <div className="bg-brand-green/20 border-2 border-brand-green rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  Para questões sobre privacidade, entre em contato:
                </p>
                <p className="font-bold text-slate-800 dark:text-dark-text mt-2">
                  📧 Email: privacy@smileycode.com.br<br />
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

export default PrivacyPolicyPage;