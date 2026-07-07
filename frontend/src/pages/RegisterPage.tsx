import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

import seseLogo from '../assets/sese_white_logo.png';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'Pelo menos 8 caracteres',          test: (pw) => pw.length >= 8 },
  { label: 'Pelo menos uma letra maiúscula',   test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Pelo menos uma letra minúscula',   test: (pw) => /[a-z]/.test(pw) },
  { label: 'Pelo menos um número',             test: (pw) => /[0-9]/.test(pw) },
  { label: 'Pelo menos um caractere especial', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function getPasswordStrength(password: string): number {
  if (!password) return 0;
  return PASSWORD_REQUIREMENTS.filter((r) => r.test(password)).length;
}

const STRENGTH_LABELS = ['', 'Muito Fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [errors, setErrors]             = useState<FieldErrors>({});
  const [apiError, setApiError]         = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!formData.firstName.trim()) errs.firstName = 'Nome é obrigatório.';
    if (!formData.lastName.trim())  errs.lastName  = 'Sobrenome é obrigatório.';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errs.email = 'Email é obrigatório.';
    } else if (!emailRe.test(formData.email)) {
      errs.email = 'Insira um email válido (ex: nome@dominio.com).';
    }

    if (!formData.password) {
      errs.password = 'Senha é obrigatória.';
    } else {
      const failing = PASSWORD_REQUIREMENTS.filter((r) => !r.test(formData.password));
      if (failing.length > 0) {
        errs.password = `Requisitos não atendidos: ${failing.map((r) => r.label.toLowerCase()).join(', ')}.`;
      }
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmação de senha é obrigatória.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'As senhas não coincidem.';
    }

    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8003/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name:       formData.firstName,
          last_name:        formData.lastName,
          email:            formData.email,
          password:         formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.detail ?? 'Erro ao realizar cadastro. Tente novamente.');
        return;
      }

      setSuccess(true);
    } catch {
      setApiError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: keyof FieldErrors) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 ${
      errors[field]
        ? 'border-red-400 dark:border-red-500 focus:ring-red-300/30 focus:border-red-400'
        : 'border-gray-200 dark:border-gray-600 focus:ring-brand-primary/20 focus:border-brand-primary'
    }`;

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
        @keyframes slow-spin     { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes slow-spin-rev { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes req-pop {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bar-fill { from { width: 0; } }

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
        .slide-in-6 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.55s both; }
        .slide-in-7 { animation: slide-in 0.55s cubic-bezier(.4,0,.2,1) 0.65s both; }
        .ring-spin     { animation: slow-spin     30s linear infinite; }
        .ring-spin-rev { animation: slow-spin-rev 20s linear infinite; }
        .pulse-ring    { animation: pulse-ring 3s ease-out infinite; }
        .req-item { animation: req-pop 0.25s ease both; }
        .strength-bar { animation: bar-fill 0.4s ease both; }
      `}</style>

      {/* ── LEFT PANEL ── */}
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

      {/* ── RIGHT PANEL — FORM ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-brand-accent transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 transition-all my-8">

          <div className="slide-in-1 text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crie sua conta</h1>
            <p className="text-gray-500 dark:text-gray-400">Preencha os dados abaixo para começar</p>
          </div>

          {/* ── Success banner ── */}
          {success && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Cadastro realizado com sucesso!
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-0.5">
                  Entre em contato com um administrador para que sua conta seja aprovada antes de fazer login.
                </p>
              </div>
            </div>
          )}

          {/* ── API error banner ── */}
          {apiError && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Nome + Sobrenome */}
            <div className="slide-in-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nome</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className={inputClass('firstName')} placeholder="João" />
                </div>
                {errors.firstName && <FieldError message={errors.firstName} />}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Último Nome</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className={inputClass('lastName')} placeholder="Silva" />
                </div>
                {errors.lastName && <FieldError message={errors.lastName} />}
              </div>
            </div>

            {/* Email */}
            <div className="slide-in-3 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className={inputClass('email')} placeholder="seu@email.com" />
              </div>
              {errors.email && <FieldError message={errors.email} />}
            </div>

            {/* Senha */}
            <div className="slide-in-4 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass('password')} pr-12`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <FieldError message={errors.password} />}

              <div className="mt-3 space-y-3">
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className="h-1.5 flex-1 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                        <div
                          className="h-full rounded-full strength-bar transition-all duration-500"
                          style={{
                            width: strength >= level ? '100%' : '0%',
                            backgroundColor: strength >= level ? STRENGTH_COLORS[strength] : 'transparent',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {formData.password && (
                    <p className="text-xs font-medium transition-colors duration-300"
                      style={{ color: STRENGTH_COLORS[strength] }}>
                      Força da senha: {STRENGTH_LABELS[strength]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/50">
                  {PASSWORD_REQUIREMENTS.map((req, i) => {
                    const met = req.test(formData.password);
                    return (
                      <div key={i} className="req-item flex items-center gap-2" style={{ animationDelay: `${i * 0.05}s` }}>
                        {met
                          ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                          : <XCircle className="h-4 w-4 flex-shrink-0 text-gray-300 dark:text-gray-500" />}
                        <span className={`text-xs transition-colors duration-200 ${
                          met ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Confirmação de Senha */}
            <div className="slide-in-5 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirmação de Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass('confirmPassword')} pr-12`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary transition-colors">
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <FieldError message={errors.confirmPassword} />}
            </div>

            {/* Submit */}
            <div className="slide-in-7">
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-secondary disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 transition-all duration-200 mt-2"
              >
                {isLoading ? 'Cadastrando...' : 'Realizar Cadastro'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <button onClick={() => navigate('/login')}
                className="text-brand-primary hover:text-brand-secondary font-bold hover:underline transition-all">
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-xs text-red-500 dark:text-red-400 mt-1 ml-1 flex items-center gap-1">
      <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}