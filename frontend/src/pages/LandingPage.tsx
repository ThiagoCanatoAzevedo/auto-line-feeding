import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Database, Layout, BarChart2, Clock, Activity } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

import seseLogo from '../assets/sese_blue_logo.png';
import heroBg from '../assets/hero_bg.jpg';
import thiagoPhoto from '../assets/crcld_thiago.png';
import nataPhoto from '../assets/crlcd_nata.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* ───────────── HEADER ───────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">

          {/* Logo Sesé + CIAL clicável */}
          <button onClick={scrollToTop} className="flex items-center space-x-3 hover:opacity-75 transition-opacity">
            <img src={seseLogo} alt="Logo Sesé" className="h-9 w-auto object-contain" />
            <div className="w-px h-7 bg-gray-300 dark:bg-gray-600" />
            <span className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">CIAL</span>
          </button>

          {/* Nav central */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {[
              { label: 'Sobre o CIAL', id: 'sobre' },
              { label: 'Benefícios', id: 'beneficios' },
              { label: 'Números', id: 'numeros' },
              { label: 'Equipe', id: 'idealizadores' },
            ].map(({ label, id }) => (
              <button key={id} onClick={() => scrollToSection(id)}
                className="text-gray-600 hover:text-brand-primary dark:text-gray-300 dark:hover:text-brand-accent transition-colors font-medium">
                {label}
              </button>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors">
              Entrar
            </button>
            <button onClick={() => navigate('/register')}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-primary/30">
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-accent/15 rounded-full blur-[100px]" />
        </div>

        <style>{`
          @keyframes underline-grow {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
          .highlight-text {
            position: relative;
            display: inline;
          }
          .highlight-text::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 100%;
            height: 5px;
            border-radius: 3px;
            background: linear-gradient(90deg, #3b82f6 0%, #818cf8 100%);
            transform: scaleX(0);
            transform-origin: left center;
            animation: underline-grow 0.9s cubic-bezier(.4,0,.2,1) 0.6s forwards;
          }
        `}</style>

        <div className="relative z-10 container mx-auto px-6 pt-32 pb-24 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Esquerda */}
            <div className="text-left">

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-[1.15]">
                Central Inteligente de{' '}
                Atendimento de Linha
              </h1>

              <p className="text-lg md:text-xl text-gray-200 max-w-[48ch] leading-relaxed mb-10">
                O sistema CIAL vai revolucionar o modelo de atendimento de linha de montagem, automatizando o processo,
                otimizando o fluxo de peças e garantindo a eficiência máxima em cada takt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/register')}
                  className="px-7 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-brand-primary/60 flex items-center justify-center group">
                  Criar Conta
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => scrollToSection('sobre')}
                  className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-semibold transition-all backdrop-blur-sm">
                  Saiba Mais
                </button>
              </div>
            </div>

            {/* Direita — cards maiores */}
            <div className="hidden md:flex flex-col gap-6 ml-auto w-full max-w-md">
              {[
                { icon: <Clock className="w-7 h-7 text-brand-primary" />, title: 'Takt Time em Tempo Real', desc: 'Monitoramento contínuo do ritmo de produção com alertas automáticos para desvios.' },
                { icon: <BarChart2 className="w-7 h-7 text-brand-primary" />, title: 'Gestão de Componentes', desc: 'Controle automatizado do consumo e reabastecimento de peças em cada estação.' },
                { icon: <Zap className="w-7 h-7 text-brand-primary" />, title: 'Zero Paradas de Linha', desc: 'Solicitações preditivas antes que o estoque chegue ao limite crítico de operação.' },
              ].map((card, idx) => (
                <div key={idx} className="flex items-start gap-5 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/15 transition-all">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg mb-1.5">{card.title}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
            <span>Role para explorar</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ───────────── SOBRE ───────────── */}
      <section id="sobre" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 aspect-video flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5" />
                <div className="text-center z-10">
                  <Database className="w-16 h-16 mx-auto text-brand-primary/40 mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-gray-400 font-medium">Interface do Sistema CIAL</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">O que o CIAL faz?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Desenvolvido internamente pela equipe da Sesé, o CIAL (Central Inteligente de Atendimento de Linha)
                é o cérebro por trás da nossa linha de montagem automatizada.
              </p>
              <ul className="space-y-4">
                {[
                  'Cálculos matemáticos precisos em tempo real',
                  'Monitoramento das requisições atuais da linha',
                  'Gestão automática de consumo de peças',
                  'Solicitação inteligente de reabastecimento',
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center mt-1 mr-3">
                      <div className="w-2 h-2 rounded-full bg-brand-primary" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── BENEFÍCIOS ───────────── */}
      <section id="beneficios" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Por que o CIAL é essencial?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Benefícios diretos que impactam a produtividade e a qualidade da nossa produção.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-8 h-8 text-brand-primary" />, title: 'Alta Eficiência', desc: 'Redução drástica no tempo de parada de linha por falta de componentes.' },
              { icon: <Shield className="w-8 h-8 text-brand-primary" />, title: 'Confiabilidade', desc: 'Dados precisos e cálculos robustos garantem a operação contínua.' },
              { icon: <Layout className="w-8 h-8 text-brand-primary" />, title: 'Interface Intuitiva', desc: 'Design moderno e fácil de usar para operadores e gestores.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── NÚMEROS ───────────── */}
      <section id="numeros" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 30%, #2563eb 55%, #1e40af 75%, #1e3a8a 100%)' }} />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">O CIAL em Números</h2>
            <p className="text-blue-200 text-lg">Resultados reais que refletem o impacto do sistema no chão de fábrica.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '98%',   label: 'Disponibilidade de Linha',  icon: <Activity className="w-7 h-7" /> },
              { value: '<2min', label: 'Tempo Médio de Resposta',    icon: <Clock className="w-7 h-7" /> },
              { value: '100%',  label: 'Rastreabilidade de Peças',   icon: <Database className="w-7 h-7" /> },
              { value: '3x',    label: 'Ganho de Produtividade',     icon: <BarChart2 className="w-7 h-7" /> },
            ].map((stat, idx) => (
              <div key={idx}
                className="flex flex-col items-center text-center p-7 rounded-2xl border border-white/10 hover:border-white/25 transition-all group"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                  {stat.icon}
                </div>
                <span className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{stat.value}</span>
                <span className="text-blue-200 text-sm font-medium leading-snug">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── IDEALIZADORES ───────────── */}
      <section id="idealizadores" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Idealizadores do Sistema</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">As pessoas por trás da visão e execução do CIAL.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-10 max-w-3xl mx-auto">
            {[
              { photo: thiagoPhoto, name: 'Thiago Canato de Azevedo', role: 'Desenvolvedor & Engenheiro de Software', desc: 'Responsável pela arquitetura técnica e desenvolvimento de todo o sistema CIAL.' },
              { photo: nataPhoto,   name: 'Nata da Silva',             role: 'Coordenador da Equipe de Planejamento', desc: 'Liderou o planejamento estratégico e os processos da linha de montagem que guiam o CIAL.' },
            ].map((person, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-brand-primary/30 mb-6 group-hover:scale-105 transition-transform shadow-md">
                  <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{person.name}</h3>
                <span className="text-brand-primary font-semibold text-sm mb-4">{person.role}</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">

            {/* Logo clicável */}
            <button onClick={scrollToTop} className="flex items-center space-x-3 hover:opacity-75 transition-opacity">
              <img src={seseLogo} alt="Logo Sesé" className="h-7 w-auto object-contain" />
              <div className="w-px h-6 bg-gray-700" />
              <span className="text-2xl font-bold text-white">CIAL</span>
            </button>

            {/* Descrição central */}
            <p className="text-gray-400 text-sm max-w-xs text-center hidden md:block">
              Central Inteligente de Atendimento de Linha.<br />Inovação e eficiência para a indústria.
            </p>

            {/* Navegação lado a lado */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500 mb-3">Navegação</p>
              <div className="flex flex-row gap-5">
                {[
                  { label: 'Sobre', id: 'sobre' },
                  { label: 'Benefícios', id: 'beneficios' },
                  { label: 'Números', id: 'numeros' },
                  { label: 'Equipe', id: 'idealizadores' },
                ].map(({ label, id }) => (
                  <button key={id} onClick={() => scrollToSection(id)}
                    className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Sesé. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}