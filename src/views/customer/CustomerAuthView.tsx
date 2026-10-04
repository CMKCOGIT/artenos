import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Store,
  Factory,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { loginSchema, registerCustomerSchema } from '../../schemas/auth.schema';
import { IntegrationPending } from '../../components/common/IntegrationPending';

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
  const { login, register, navigate, setCurrentRole, setIsArchitectureOpen } = useMarketplace();

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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPending, setShowPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = loginSchema.safeParse({
      email: loginEmail,
      password: loginPassword,
      role: 'customer',
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errs[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errs);
      return;
    }

    const res = await login({ email: loginEmail, password: loginPassword, role: 'customer' });
    if (!res.success) {
      setPendingMessage(res.error || 'Credenciais inválidas no Supabase.');
      setShowPending(true);
    } else {
      if (onSuccess) onSuccess();
      else navigate('/perfil');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = registerCustomerSchema.safeParse({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      cpf: regCpf,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errs[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errs);
      return;
    }

    const res = await register({
      role: 'customer',
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      cpf: regCpf,
    });

    if (!res.success) {
      setPendingMessage(res.error || 'Erro ao registrar conta no Supabase.');
      setShowPending(true);
    } else {
      if (onSuccess) onSuccess();
      else navigate('/perfil');
    }
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

      {showPending && (
        <div className="mb-6">
          <IntegrationPending
            title="Autenticação Pendente"
            actionName="Acesso à Conta"
            description={pendingMessage}
            onViewArchitecture={() => setIsArchitectureOpen(true)}
            onClose={() => setShowPending(false)}
          />
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
                Adquira cerâmicas, crochês, amigurumis e bordados com garantia de procedência artesanal e split ético de 90% para a artesã.
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
            </div>
          </div>

          {/* Role selector shortcuts */}
          <div className="mt-8 pt-6 border-t border-[#EADBCC] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] block mb-2">
              Não é um comprador?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('artisan');
                  navigate('/artesa/cadastrar');
                }}
                className="p-2.5 bg-[#FAF7F2] hover:bg-[#EFE6DC] border border-[#D9CDBF] rounded-xl text-left text-xs font-semibold text-[#2D241E] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-[#8E3E19]" />
                <span className="truncate">Sou Artesã</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('supplier');
                  navigate('/fornecedor/cadastrar');
                }}
                className="p-2.5 bg-[#FAF7F2] hover:bg-[#EFE6DC] border border-[#D9CDBF] rounded-xl text-left text-xs font-semibold text-[#2D241E] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Factory className="w-3.5 h-3.5 text-[#1A543E]" />
                <span className="truncate">Sou Fornecedor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex border-b border-[#EADBCC] mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setFormErrors({});
              }}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors relative cursor-pointer mr-6 ${
                activeTab === 'login' ? 'text-[#8E3E19]' : 'text-[#8C7667] hover:text-[#2D241E]'
              }`}
            >
              Entrar na Conta
              {activeTab === 'login' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8E3E19]" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setFormErrors({});
              }}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors relative cursor-pointer ${
                activeTab === 'register' ? 'text-[#8E3E19]' : 'text-[#8C7667] hover:text-[#2D241E]'
              }`}
            >
              Criar Nova Conta
              {activeTab === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8E3E19]" />
              )}
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7667] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
                {formErrors.email && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7667] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
                {formErrors.password && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.password}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
              >
                Acessar Minha Conta
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7667] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
                {formErrors.name && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Senha</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 dígitos"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                  {formErrors.password && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.password}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CPF (opcional)</label>
                  <input
                    type="text"
                    value={regCpf}
                    onChange={(e) => setRegCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
              >
                Concluir Cadastro de Comprador
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
