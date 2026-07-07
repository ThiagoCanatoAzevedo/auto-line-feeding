import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, XCircle } from 'lucide-react';

import seseLogo from '../assets/sese_white_logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [isLoading, setIsLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8003/user/access/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        const rawError: string = data.detail ?? 'Erro ao realizar login. Tente novamente.';
        const cleanError = rawError.replace(/^Internal error while[^:]*:\s*\d+:\s*/i, '');
        setApiError(cleanError);
        return;
      }

      // Persiste tokens e dados do usuário
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('access_token',  data.access_token);
      storage.setItem('refresh_token', data.refresh_token);
      storage.setItem('user',          JSON.stringify(data.user));

      navigate('/');
    } catch {
      setApiError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <style>{`
        @keyframes orb-move-1 {
          0%, 100% { transform: translate(0px, 0px); }
          33%       { transform: translate(40px, -30px); }
          66%       { transform: translate(-20px, 20px); }
        }
        @keyframes orb-move-2 {
          0%, 100% { transform: translate(0px, 0px); }
          33%       { transform: translate(-35px, 25px); }
          66%       { transform: translate(25px, -15px); }
        }
        @keyframes orb-move-3 {
          0%, 100% { transform: translate(0px, 0px); }
          50%       { transform: translate(20px, 30px); }
        }
        @keyframes line-draw {
          from { stroke-dashoffset: 1000; opacity: 0.0; }
          to   { stroke-dashoffset: 0;    opacity: 0.18; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slow-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }

        .orb-1 { animation: orb-move-1 18s ease-in-out infinite; }
        .orb-2 { animation: orb-move-2 22s ease-in-out infinite; }
        .orb-3 { animation: orb-move-3 15s ease-in-out infinite; }
        .line-path { stroke-dasharray: 1000; animation: line-draw 3s ease forwards; }
        .fade-up-1 { animation: fade-up 0.7s cubic-bezier(.4,0,.2,1) 0.1s both; }
        .fade-up-2 { animation: fade-up 0.7s cubic-bezier(.4,0,.2,1) 0.25s both; }
        .fade-up-3 { animation: fade-up 0.7s cubic-bezier(.4,0,.2,1) 0.4s both; }
        .slide-in-1 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.05s both; }
        .slide-in-2 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.15s both; }
        .slide-in-3 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.25s both; }
        .slide-in-4 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.35s both; }
        .slide-in-5 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.45s both; }
        .ring-spin     { animation: slow-spin     30s linear infinite; }
        .ring-spin-rev { animation: slow-spin-rev 20s linear infinite; }
        .pulse-ring    { animation: pulse-ring 3s ease-out infinite; }
      `}</style>

      {/* ── LADO ESQUERDO ── */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 70%, #1e40af 100%)' }}
      >
        <div className="orb-1 absolute top-[15%] left-[20%] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.22) 0%, transparent 70%)' }} />
        <div className="orb-2 absolute bottom-[10%] right-[15%] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)' }} />
        <div className="orb-3 absolute top-[55%] left-[50%] w-[260px] h-[260px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" fill="none">
          <path className="line-path" d="M0 200 Q150 180 300 300 T600 250" stroke="white" strokeWidth="1"/>
          <path className="line-path" d="M0 400 Q200 350 400 420 T600 380" stroke="white" strokeWidth="0.8" style={{animationDelay:'0.4s'}}/>
          <path className="line-path" d="M100 0 Q180 200 150 400 T200 750" stroke="white" strokeWidth="0.7" style={{animationDelay:'0.8s'}}/>
          <path className="line-path" d="M450 0 Q400 200 430 450 T380 750" stroke="white" strokeWidth="0.7" style={{animationDelay:'1.1s'}}/>
          <path className="line-path" d="M0 600 Q300 520 600 580" stroke="white" strokeWidth="0.6" style={{animationDelay:'1.4s'}}/>
          <circle cx="300" cy="300" r="3" fill="rgba(255,255,255,0.25)" />
          <circle cx="150" cy="400" r="2" fill="rgba(255,255,255,0.2)" />
          <circle cx="430" cy="420" r="2.5" fill="rgba(255,255,255,0.2)" />
          <circle cx="200" cy="180" r="2" fill="rgba(255,255,255,0.15)" />
          <circle cx="480" cy="560" r="2" fill="rgba(255,255,255,0.15)" />
        </svg>

        <div className="absolute" style={{ left: '50%', top: '46%', transform: 'translate(-50%, -50%)' }}>
          <div className="ring-spin w-[320px] h-[320px] rounded-full border border-white/8 absolute"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-300/50" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-300/50" />
          </div>
          <div className="ring-spin-rev w-[220px] h-[220px] rounded-full border border-white/12 absolute"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-300/60" />
          </div>
          <div className="pulse-ring absolute w-[130px] h-[130px] rounded-full border border-blue-300/30"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
          <div className="fade-up-1 mb-12">
            <img src={seseLogo} alt="Sesé" className="h-28 w-auto object-contain" />
          </div>
          <div className="fade-up-2 flex items-center gap-3 mb-6 w-full">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/80 text-xs tracking-[0.2em] uppercase font-medium">Sistema</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>
          <div className="fade-up-2 mb-6">
            <span className="text-8xl font-extrabold text-white tracking-tight">CIAL</span>
          </div>
          <p className="fade-up-3 text-blue-200/90 text-lg leading-relaxed max-w-[28ch]">
            Central Inteligente de Atendimento de Linha
          </p>
          <div className="fade-up-3 flex items-center gap-4 mt-12">
            {['Monitoramento', 'Automação', 'Eficiência'].map((tag, i) => (
              <span key={i}
                className="px-5 py-2 rounded-full text-base font-medium text-blue-100/90 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* ── LADO DIREITO — FORMULÁRIO ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-brand-accent transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 transition-all">

          <div className="slide-in-1 text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">Entre com suas credenciais para acessar</p>
          </div>

          {/* ── API error banner ── */}
          {apiError && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            <div className="slide-in-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setApiError(null); }}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="slide-in-3 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setApiError(null); }}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="slide-in-4 flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
                />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  Manter conectado
                </span>
              </label>
            </div>

            <div className="slide-in-5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-secondary disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-brand-primary hover:text-brand-secondary font-bold hover:underline transition-all"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}