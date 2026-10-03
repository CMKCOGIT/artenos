import React, { useState } from 'react';
import {
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Store,
  Factory,
  Calculator,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Heart,
  Truck,
  HelpCircle,
} from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';

export const PlatformOnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    setCurrentRole,
    navigate,
  } = useMarketplace();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const handleFinish = (targetRole?: 'customer' | 'artisan' | 'supplier') => {
    localStorage.setItem('artenos_onboarding_completed_v1', 'true');
    setIsOnboardingOpen(false);
    if (targetRole) {
      setCurrentRole(targetRole);
    }
  };

  const steps = [
    {
      id: 'welcome',
      tag: 'Visão Geral',
      title: 'Bem-vindo(a) à Artenós',
      subtitle: 'A plataforma que conecta quem faz, quem vende e quem compra artesanato brasileiro.',
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#5C4A3E] leading-relaxed">
            A <strong>Artenós</strong> não é um marketplace genérico. Criamos um ecossistema completo para valorizar o trabalho manual, eliminar intermediários abusivos e profissionalizar as artesãs do Brasil com tecnologia ética.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E9DFD2] text-left">
              <div className="w-8 h-8 rounded-lg bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center mb-2.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#2D241E] mb-1">Para Compradores</h4>
              <p className="text-[11px] text-[#735F52] leading-normal">
                Peças exclusivas, feitas à mão, com contato direto com a criadora e encomenda sob medida.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E9DFD2] text-left">
              <div className="w-8 h-8 rounded-lg bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center mb-2.5">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#2D241E] mb-1">Para Artesãs</h4>
              <p className="text-[11px] text-[#735F52] leading-normal">
                Ateliê online, precificação sem prejuízo, compras de insumos no atacado e 90% do valor da venda.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E9DFD2] text-left">
              <div className="w-8 h-8 rounded-lg bg-[#1A543E]/10 text-[#1A543E] flex items-center justify-center mb-2.5">
                <Factory className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#2D241E] mb-1">Para Fornecedores</h4>
              <p className="text-[11px] text-[#735F52] leading-normal">
                Venda direta de fios, argilas e embalagens em lote para milhares de ateliês conectados.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#F4EDE2] rounded-xl border border-[#E2D4C3] flex items-start gap-3 text-xs text-[#5C4A3E]">
            <ShieldCheck className="w-4 h-4 text-[#8E3E19] shrink-0 mt-0.5" />
            <p>
              <strong>Split de Pagamento Ético:</strong> 90% do valor de qualquer peça vai direto para a conta da artesã criadora. Os 10% financiam a infraestrutura e o suporte humano.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'customer',
      tag: 'Jornada do Comprador',
      title: 'Como Encontrar e Comprar Peças Únicas',
      subtitle: 'Compre artesanato com alma, converse com a artesã e personalize.',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#5C4A3E] leading-relaxed">
            Navegue pela vitrine pública para descobrir peças autênticas de crochê, cerâmica, macramê e bordado tradicional de diversas regiões do país.
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
              <span className="w-6 h-6 rounded-full bg-[#8E3E19] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <div>
                <h5 className="text-xs font-bold text-[#2D241E]">Catálogo por Técnicas Tradicionais</h5>
                <p className="text-[11px] text-[#735F52]">Filtre por categoria, pronta entrega ou veja a história da artesã que produziu cada peça.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
              <span className="w-6 h-6 rounded-full bg-[#8E3E19] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <div>
                <h5 className="text-xs font-bold text-[#2D241E]">Chat Direto com a Artesã</h5>
                <p className="text-[11px] text-[#735F52]">Tire dúvidas sobre medidas, materiais ou solicite alterações de cor antes de fechar o pedido.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
              <span className="w-6 h-6 rounded-full bg-[#8E3E19] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <div>
                <h5 className="text-xs font-bold text-[#2D241E]">Encomendas Personalizadas</h5>
                <p className="text-[11px] text-[#735F52]">Use o formulário na página inicial para enviar sua ideia ou dimensões específicas para a rede.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'artisan',
      tag: 'Painel da Artesã',
      title: 'Seu Ateliê Digital & Precificação Justa',
      subtitle: 'Ferramentas profissionais para gerenciar vendas, estoque e calcular lucro real.',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#5C4A3E] leading-relaxed">
            Muitas artesãs enfrentam dificuldade em precificar seu trabalho e acabam vendendo sem lucro. No <strong>Painel da Artesã</strong>, você tem ferramentas de gestão completas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
              <div className="flex items-center gap-2 mb-1.5">
                <Calculator className="w-4 h-4 text-[#8E3E19]" />
                <h5 className="text-xs font-bold text-[#2D241E]">Calculadora de Precificação</h5>
              </div>
              <p className="text-[11px] text-[#735F52] leading-relaxed">
                Insira o tempo de confecção, custos de linhas e argilas, e defina sua margem de lucro líquida com total transparência.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
              <div className="flex items-center gap-2 mb-1.5">
                <Layers className="w-4 h-4 text-[#8E3E19]" />
                <h5 className="text-xs font-bold text-[#2D241E]">Controle de Estoque & Pedidos</h5>
              </div>
              <p className="text-[11px] text-[#735F52] leading-relaxed">
                Acompanhe o que está em produção, prazos de envio, alertas de estoque baixo e histórico financeiro.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] flex items-center justify-between text-xs">
            <span className="text-[#5C4A3E]">Quer testar a calculadora de preços agora mesmo?</span>
            <button
              onClick={() => handleFinish('artisan')}
              className="px-3 py-1.5 bg-[#8E3E19] hover:bg-[#733113] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
            >
              Abrir Painel da Artesã
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'navigation',
      tag: 'Navegação Fácil',
      title: 'Como Alternar Entre os Perfis',
      subtitle: 'Uma só conta ou perfis independentes para navegar por todo o ecossistema.',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#5C4A3E] leading-relaxed">
            Você pode explorar livremente as diferentes interfaces da Artenós usando a <strong>barra superior de alternância</strong>:
          </p>

          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] space-y-3">
            <div className="text-xs font-semibold text-[#2D241E] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8E3E19]" />
              <span>Barra Superior no Topo da Tela:</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <div className="px-3 py-1.5 bg-white rounded-lg border border-[#D9CDBF] font-medium text-[#2D241E]">
                🛍️ Comprador (Área Pública)
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-[#D9CDBF] font-medium text-[#8E3E19]">
                🎨 Painel da Artesã
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-[#D9CDBF] font-medium text-[#1A543E]">
                🏭 Painel do Fornecedor
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-[#D9CDBF] font-medium text-amber-800">
                🛡️ Governança / Admin
              </div>
            </div>

            <p className="text-[11px] text-[#735F52] leading-relaxed">
              Cada perfil possui autenticação independente com suporte a sessões salvas. Se precisar de ajuda em qualquer momento, clique no botão <strong>"Como Funciona"</strong> no topo da página.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => handleFinish('customer')}
              className="p-3 bg-white hover:bg-[#FAF7F2] border border-[#EADBCC] rounded-xl text-left cursor-pointer transition-all hover:border-[#8E3E19]"
            >
              <span className="text-xs font-bold text-[#8E3E19] block mb-0.5">Explorar como Comprador</span>
              <span className="text-[11px] text-[#735F52]">Ver catálogo e novidades</span>
            </button>
            <button
              onClick={() => handleFinish('artisan')}
              className="p-3 bg-white hover:bg-[#FAF7F2] border border-[#EADBCC] rounded-xl text-left cursor-pointer transition-all hover:border-[#8E3E19]"
            >
              <span className="text-xs font-bold text-[#8E3E19] block mb-0.5">Entrar como Artesã</span>
              <span className="text-[11px] text-[#735F52]">Ver ateliê e precificação</span>
            </button>
            <button
              onClick={() => handleFinish('supplier')}
              className="p-3 bg-white hover:bg-[#FAF7F2] border border-[#EADBCC] rounded-xl text-left cursor-pointer transition-all hover:border-[#1A543E]"
            >
              <span className="text-xs font-bold text-[#1A543E] block mb-0.5">Acessar Fornecedor</span>
              <span className="text-[11px] text-[#735F52]">Ver cotações e insumos</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5DACD] max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#FAF7F2] border-b border-[#EADDCE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8E3E19] text-white flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E3E19]">
                Guia da Plataforma · {activeStep.tag}
              </span>
              <span className="text-[11px] sm:text-xs text-[#8C7667] ml-2">
                ({currentStep + 1}/{steps.length})
              </span>
            </div>
          </div>

          <button
            onClick={() => handleFinish()}
            className="p-1.5 text-[#8C7667] hover:text-[#2D241E] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
            title="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="w-full bg-[#EADBCC] h-1 flex">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-[#8E3E19]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2D241E] mb-1">
              {activeStep.title}
            </h3>
            <p className="text-xs text-[#735F52]">
              {activeStep.subtitle}
            </p>
          </div>

          {activeStep.content}
        </div>

        {/* Footer Navigation */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#FAF7F2] border-t border-[#EADDCE] flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-[#8C7667]'
                : 'text-[#4A3B32] hover:bg-[#EADBCC]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Anterior</span>
          </button>

          {/* Quick Step Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-5 sm:w-6 bg-[#8E3E19]'
                    : 'bg-[#D9CDBF] hover:bg-[#8E3E19]/60'
                }`}
                title={`Ir para passo ${idx + 1}`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#8E3E19] hover:bg-[#733113] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleFinish('customer')}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#8E3E19] hover:bg-[#733113] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
