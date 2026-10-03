import React, { useState } from 'react';
import {
  Factory,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  FileCheck2,
  ArrowRight,
  Mail,
  Lock,
  Building2,
  Phone,
  MapPin,
  Check,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

interface SupplierAuthViewProps {
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const SupplierAuthView: React.FC<SupplierAuthViewProps> = ({
  initialTab = 'login',
  onSuccess,
}) => {
  const { login, register, navigate, setCurrentRole } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [category, setCategory] = useState('Linhas, Fios & Barbantes');
  const [location, setLocation] = useState('Americana - SP');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

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
        role: 'supplier',
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Empresa autenticada com sucesso! Acessando portal B2B...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/fornecedor/dashboard');
        }, 700);
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
        role: 'supplier',
        name: companyName,
        companyName,
        email,
        password,
        phone,
        cnpj,
        category,
        location,
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Fornecedor credenciado com sucesso! Seja bem-vindo à rede Artenós.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/fornecedor/dashboard');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Erro ao credenciar empresa.');
      }
    }, 500);
  };

  const handleDemoLogin = () => {
    setLoginEmail('comercial@fiosbrasil.ind.br');
    setLoginPassword('••••••••');
    setIsLoading(true);

    setTimeout(() => {
      login({
        email: 'comercial@fiosbrasil.ind.br',
        password: 'demo',
        role: 'supplier',
      });
      setIsLoading(false);
      setSuccessMsg('Conectado como Fios & Fibras Brasil Indústria!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate('/fornecedor/dashboard');
      }, 700);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F0F5F2] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Return to Public Vitrine Button */}
      <div className="max-w-5xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentRole('customer');
            navigate('/');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-[#4A6E5D] hover:text-[#122B20] bg-white px-3 py-1.5 rounded-xl border border-[#D2E3DB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Vitrine de Compras</span>
        </button>

        <span className="text-xs font-bold text-[#1A543E] flex items-center gap-1">
          <Factory className="w-4 h-4" />
          <span>Portal do Fornecedor de Insumos</span>
        </span>
      </div>

      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl border border-[#D2E3DB] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Supplier Business Pitch */}
        <div className="lg:col-span-5 bg-[#EEF6F2] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D2E3DB]">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1A543E] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                F
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#122B20] block leading-none">Artenós</span>
                <span className="text-[10px] text-[#1A543E] font-bold uppercase tracking-wider">Canal de Insumos B2B</span>
              </div>
            </div>

            <div>
              <span className="bg-[#1A543E]/10 text-[#1A543E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 inline-block">
                Fornecedores Homologados
              </span>
              <h2 className="text-2xl font-bold font-serif text-[#122B20] leading-snug">
                Conecte sua indústria e atacado a milhares de ateliês artesanais.
              </h2>
              <p className="text-xs text-[#4A6E5D] mt-2 leading-relaxed">
                Venda fios, argilas, tecidos e embalagens com rastreabilidade de lote e banho, e responda a solicitações de demanda com cotações diretas.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#D2E3DB]/60 text-xs">
              <div className="flex items-start gap-2.5 text-[#1E2E25]">
                <Package className="w-4 h-4 text-[#1A543E] shrink-0 mt-0.5" />
                <span><strong>Catálogo com Lote e Tonalidade:</strong> Evite variações de cor que prejudicam peças artesanais.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#1E2E25]">
                <FileCheck2 className="w-4 h-4 text-[#1A543E] shrink-0 mt-0.5" />
                <span><strong>Demandas em Aberto:</strong> Envie propostas comerciais para pedidos volumosos de ateliês.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#1E2E25]">
                <ShieldCheck className="w-4 h-4 text-[#1A543E] shrink-0 mt-0.5" />
                <span><strong>Pagamento Garantido:</strong> Transações processadas com segurança pela infraestrutura Artenós.</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mt-8 pt-6 border-t border-[#D2E3DB]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#557567] block mb-2">
              Acesso Rápido de Teste (Fornecedor Modelo)
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-[#E0EFE8] hover:bg-[#D5E8DF] text-[#122B20] p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border border-[#CCE3D7]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1A543E] text-white flex items-center justify-center font-bold text-xs">
                  F
                </div>
                <div className="text-left">
                  <span className="font-bold block text-xs">Fios & Fibras Brasil</span>
                  <span className="text-[10px] text-[#4A6E5D]">Americana - SP · CNPJ Homologado</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#1A543E]" />
            </button>
          </div>
        </div>

        {/* Right Side: Form (Login or Register) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Tabs Switcher */}
          <div className="flex items-center bg-[#EEF6F2] p-1 rounded-2xl border border-[#D2E3DB] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#1A543E] text-white shadow-xs'
                  : 'text-[#4A6E5D] hover:text-[#122B20]'
              }`}
            >
              Entrar na Empresa
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
                  ? 'bg-[#1A543E] text-white shadow-xs'
                  : 'text-[#4A6E5D] hover:text-[#122B20]'
              }`}
            >
              Credenciar Fornecedor
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
                <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="comercial@fiosbrasil.ind.br"
                    className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1E2E25]">
                    Senha de Acesso
                  </label>
                  <a href="#/esqueci-senha" onClick={(e) => { e.preventDefault(); alert('Em produção, o link de recuperação seria enviado ao e-mail comercial.'); }} className="text-[11px] text-[#1A543E] hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha corporativa"
                    className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A543E] hover:bg-[#123D2C] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Autenticando empresa...' : 'Acessar Painel do Fornecedor'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#557567]">
                  Sua empresa ainda não vende na Artenós?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-[#1A543E] hover:underline cursor-pointer"
                  >
                    Credencie sua empresa agora
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                    Razão Social / Nome da Empresa
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Cerâmica Vale Verde Ltda"
                      className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] px-3.5 py-2.5 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                    Categoria Principal de Fornecimento
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] px-3.5 py-2.5 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  >
                    <option value="Linhas, Fios & Barbantes">Linhas, Fios & Barbantes</option>
                    <option value="Argilas & Cerâmicas">Argilas & Cerâmicas</option>
                    <option value="Tecidos & Linho Puro">Tecidos & Linho Puro</option>
                    <option value="Madeiras Nobres & Bastidores">Madeiras Nobres & Bastidores</option>
                    <option value="Embalagens Sustentáveis & Caixas">Embalagens Sustentáveis & Caixas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                    Cidade / Estado (Origem de Envio)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Americana - SP"
                      className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                    E-mail Corporativo
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="comercial@empresa.com.br"
                      className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                    Contato Comercial WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(19) 98765-4321"
                      className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2E25] mb-1">
                  Criar Senha Corporativa
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#638C7A] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#FAFDFC] rounded-xl border border-[#C5DED2] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A543E] hover:bg-[#123D2C] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Credenciando...' : 'Finalizar Credenciamento & Cadastrar Lotes'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#557567]">
                  Já possui conta homologada?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-bold text-[#1A543E] hover:underline cursor-pointer"
                  >
                    Fazer login
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
