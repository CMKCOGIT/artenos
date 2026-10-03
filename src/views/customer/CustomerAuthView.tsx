import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  FileText,
  MapPin,
  Check,
  Store,
  Factory,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

interface CustomerAuthViewProps {
  initialTab?: 'login' | 'register';
  redirectReason?: string;
  onSuccess?: () => void;
}

export const CustomerAuthView: React.FC<CustomerAuthViewProps> = ({
  initialTab = 'login',
  redirectReason,
  onSuccess,
}) => {
  const { login, register, navigate, setCurrentRole } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login({
        email: loginEmail,
        password: loginPassword,
        role: 'customer',
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Login realizado com sucesso! Redirecionando...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Credenciais inválidas.');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = register({
        role: 'customer',
        name: regName,
        email: regEmail,
        password: regPassword,
        cpf: regCpf,
        phone: regPhone,
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Conta criada com sucesso! Bem-vindo(a) à Artenós.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Erro ao registrar.');
      }
    }, 500);
  };

  const handleDemoLogin = () => {
    setLoginEmail('kaike@artenos.com.br');
    setLoginPassword('••••••••');
    setIsLoading(true);

    setTimeout(() => {
      login({
        email: 'kaike@artenos.com.br',
        password: 'demo',
        role: 'customer',
      });
      setIsLoading(false);
      setSuccessMsg('Conectado como Kaike Elias (Comprador)!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate('/');
      }, 700);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Informative top notification if redirected */}
      {redirectReason && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
          <ShieldCheck className="w-5 h-5 text-[#8E3E19] shrink-0" />
          <span>{redirectReason}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-[#EADBCC] shadow-sm overflow-hidden">
        {/* Left Side: Brand & Value Prop */}
        <div className="lg:col-span-5 bg-[#FAF6F0] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EADBCC]">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#8E3E19] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                A
              </div>
              <span className="font-serif font-bold text-xl text-[#2D241E]">Artenós</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E3E19] block mb-1">
                Área do Comprador
              </span>
              <h2 className="text-2xl font-bold font-serif text-[#2D241E] leading-snug">
                {activeTab === 'login' ? 'Bem-vindo(a) de volta à vitrine viva.' : 'Conecte-se às mãos que criam o Brasil.'}
              </h2>
              <p className="text-xs text-[#6B5A4E] mt-2 leading-relaxed">
                Adquira cerâmicas, crochês, amigurumis e bordados com garantia de autenticidade e split direto de 90% para a artesã.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#EADBCC]/60 text-xs">
              <div className="flex items-start gap-2.5 text-[#4A3B32]">
                <ShieldCheck className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
                <span>Pagamento seguro via PIX com split ou cartão tokenizado.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#4A3B32]">
                <Truck className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
                <span>Rastreamento em tempo real de cada etapa da confecção.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#4A3B32]">
                <Heart className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
                <span>Chat direto com as artesãs para tirar dúvidas e encomendar.</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mt-8 pt-6 border-t border-[#EADBCC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] block mb-2">
              Teste Rápido de Demonstração
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-[#EFE7DC] hover:bg-[#E4D9C9] text-[#2D241E] p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border border-[#DACBB8]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#8E3E19] text-white flex items-center justify-center font-bold text-xs">
                  K
                </div>
                <div className="text-left">
                  <span className="font-bold block text-xs">Entrar como Kaike Elias</span>
                  <span className="text-[10px] text-[#6B5A4E]">kaike@artenos.com.br</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#8E3E19]" />
            </button>
          </div>
        </div>

        {/* Right Side: Form (Login or Register) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Tabs Switcher */}
          <div className="flex items-center bg-[#FAF6F0] p-1 rounded-2xl border border-[#EADBCC] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#8E3E19] text-white shadow-xs'
                  : 'text-[#6B5A4E] hover:text-[#2D241E]'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#8E3E19] text-white shadow-xs'
                  : 'text-[#6B5A4E] hover:text-[#2D241E]'
              }`}
            >
              Criar Conta de Cliente
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  E-mail do Comprador
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ex: seu.email@exemplo.com"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#3D2E24]">
                    Senha de Acesso
                  </label>
                  <a href="#/esqueci-senha" onClick={(e) => { e.preventDefault(); alert('Em um ambiente de produção, um link de redefinição segura seria enviado para o seu e-mail.'); }} className="text-[11px] text-[#8E3E19] hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Entrando...' : 'Entrar e Acessar Vitrine'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#8C7667]">
                  Ainda não tem conta na Artenós?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-[#8E3E19] hover:underline cursor-pointer"
                  >
                    Cadastre-se gratuitamente
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Maria Clara Souza"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    CPF (para emissão de nota)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={regCpf}
                      onChange={(e) => setRegCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    WhatsApp / Telefone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Criar Senha de Acesso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Criando conta...' : 'Concluir Cadastro e Comprar'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#8C7667]">
                  Já possui cadastro?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-bold text-[#8E3E19] hover:underline cursor-pointer"
                  >
                    Fazer login
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* Links to Other Specific Portals */}
          <div className="mt-8 pt-6 border-t border-[#EADBCC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8C7667]">Deseja vender ou fornecer insumos?</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('artisan');
                  navigate('/artesa/login');
                }}
                className="text-[#8E3E19] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Portal da Artesã</span>
              </button>
              <span className="text-[#D9CDBF]">·</span>
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('supplier');
                  navigate('/fornecedor/login');
                }}
                className="text-[#1A543E] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Factory className="w-3.5 h-3.5" />
                <span>Portal do Fornecedor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
