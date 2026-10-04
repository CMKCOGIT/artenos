import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  ShieldCheck,
  Calculator,
  Boxes,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Check,
  PhoneCall,
  DollarSign,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

interface ArtisanAuthViewProps {
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const ArtisanAuthView: React.FC<ArtisanAuthViewProps> = ({
  initialTab = 'login',
  onSuccess,
}) => {
  const { login, register, navigate, setCurrentRole, setIsAssistedSignupOpen } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [artisanName, setArtisanName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [specialty, setSpecialty] = useState('Crochê & Amigurumi');
  const [location, setLocation] = useState('Caruaru - PE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [bio, setBio] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login({
        email: loginEmail,
        password: loginPassword,
        role: 'artisan',
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Ateliê conectado com sucesso! Abrindo seu painel...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/artesa/dashboard');
        }, 700);
      } else {
        setErrorMsg(res.error || 'Não foi possível acessar.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Erro ao conectar ateliê.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await register({
        role: 'artisan',
        name: artisanName,
        email,
        password,
        phone,
        studioName: studioName || `Ateliê ${artisanName}`,
        specialties: [specialty],
        location,
        pixKey: pixKey || email,
        bio,
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Ateliê cadastrado com sucesso! Bem-vinda à comunidade Artenós.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/artesa/dashboard');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Erro ao registrar ateliê.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Erro ao registrar.');
    }
  };

  const handleDemoLogin = async () => {
    setLoginEmail('maria.artesa@artenos.com.br');
    setLoginPassword('••••••••');
    setIsLoading(true);

    await login({
      email: 'maria.artesa@artenos.com.br',
      password: 'demo',
      role: 'artisan',
    });
    setIsLoading(false);
    setSuccessMsg('Conectada como Maria das Dores (Ateliê Fios de Afeto)!');
    setTimeout(() => {
      if (onSuccess) onSuccess();
      else navigate('/artesa/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Return to Public Vitrine Button */}
      <div className="max-w-5xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentRole('customer');
            navigate('/');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-[#8C7667] hover:text-[#2D241E] bg-white px-3 py-1.5 rounded-xl border border-[#EADBCC] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Vitrine de Compras</span>
        </button>

        <span className="text-xs font-bold text-[#8E3E19] flex items-center gap-1">
          <Store className="w-4 h-4" />
          <span>Portal Exclusivo da Artesã</span>
        </span>
      </div>

      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl border border-[#EADBCC] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Artisan Ecosystem Story */}
        <div className="lg:col-span-5 bg-[#FAF6F0] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EADBCC]">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#8E3E19] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                A
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#2D241E] block leading-none">Artenós</span>
                <span className="text-[10px] text-[#8E3E19] font-bold uppercase tracking-wider">Espaço da Artesã</span>
              </div>
            </div>

            <div>
              <span className="bg-[#8E3E19]/10 text-[#8E3E19] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 inline-block">
                Comunidade de Criadoras
              </span>
              <h2 className="text-2xl font-bold font-serif text-[#2D241E] leading-snug">
                Seu trabalho manual merece vitrine, respeito e renda justa.
              </h2>
              <p className="text-xs text-[#6B5A4E] mt-2 leading-relaxed">
                Administre seus produtos, receba 90% do valor da venda diretamente na sua conta e use ferramentas feitas para o ritmo do artesanato.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#EADBCC]/60 text-xs">
              <div className="flex items-start gap-2.5 text-[#4A3B32]">
                <DollarSign className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
                <span><strong>Split Direto de 90%:</strong> Sem retenções abusivas ou taxas ocultas de marketplace.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#4A3B32]">
                <Calculator className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
                <span><strong>Calculadora de Precificação:</strong> Saiba exatamente quanto cobrar pela sua hora trabalhada.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#4A3B32]">
                <Boxes className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
                <span><strong>Estoque com Baixa Automática:</strong> Evite vender mais do que as suas mãos conseguem produzir.</span>
              </div>
            </div>

            {/* Assisted Signup Callout */}
            <div className="bg-[#FAF3EA] p-4 rounded-2xl border border-[#E8DCCF] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E3E19]">
                <PhoneCall className="w-4 h-4" />
                <span>Dificuldade para cadastrar fotos ou produtos?</span>
              </div>
              <p className="text-[11px] text-[#6B5A4E]">
                Nossa equipe ajuda você pelo WhatsApp a fotografar, precificar e cadastrar suas peças gratuitamente.
              </p>
              <button
                type="button"
                onClick={() => setIsAssistedSignupOpen(true)}
                className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Solicitar Cadastro Assistido no WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mt-8 pt-6 border-t border-[#EADBCC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] block mb-2">
              Acesso Rápido de Teste (Ateliê Modelo)
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-[#EFE7DC] hover:bg-[#E4D9C9] text-[#2D241E] p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border border-[#DACBB8]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#8E3E19] text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div className="text-left">
                  <span className="font-bold block text-xs">Maria das Dores</span>
                  <span className="text-[10px] text-[#6B5A4E]">Ateliê Fios de Afeto (Caruaru - PE)</span>
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
              Entrar no Meu Ateliê
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
              Cadastrar Novo Ateliê
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
                  E-mail da Artesã
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="maria.artesa@artenos.com.br"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#3D2E24]">
                    Senha de Acesso
                  </label>
                  <a href="#/esqueci-senha" onClick={(e) => { e.preventDefault(); alert('Em produção, o link de recuperação seria enviado ao seu e-mail cadastrado.'); }} className="text-[11px] text-[#8E3E19] hover:underline">
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
                    placeholder="Sua senha"
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
                  {isLoading ? 'Acessando Ateliê...' : 'Entrar no Painel da Artesã'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#8C7667]">
                  Ainda não tem loja na Artenós?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-[#8E3E19] hover:underline cursor-pointer"
                  >
                    Cadastre seu ateliê agora
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
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Seu Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={artisanName}
                      onChange={(e) => setArtisanName(e.target.value)}
                      placeholder="Ex: Tereza Ramos"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Nome do Ateliê / Loja
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="Ex: Ateliê Nó & Barro"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Especialidade Principal
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  >
                    <option value="Crochê & Amigurumi">Crochê & Amigurumi</option>
                    <option value="Cerâmica & Argila">Cerâmica & Argila</option>
                    <option value="Bordado em Bastidor">Bordado em Bastidor</option>
                    <option value="Macramê & Fios">Macramê & Fios</option>
                    <option value="Tear & Tecelagem">Tear & Tecelagem</option>
                    <option value="Madeira & Marcenaria Manual">Madeira & Marcenaria Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Cidade / Estado
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Ouro Preto - MG"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@atelie.com"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    WhatsApp para Pedidos
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(81) 98765-4321"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Chave PIX (para repasse de 90%)
                  </label>
                  <input
                    type="text"
                    required
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="Chave PIX (CPF, E-mail ou Telefone)"
                    className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Criar Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Conte em 1 ou 2 frases a história do seu fazer manual
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ex: Aprendi a moldar argila com minha avó em Caruaru e hoje transformo terra e fogo em peças utilitárias para a casa."
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] p-3 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Cadastrando ateliê...' : 'Criar Ateliê e Começar a Vender'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#8C7667]">
                  Já cadastrou seu ateliê?{' '}
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
        </div>
      </div>
    </div>
  );
};
