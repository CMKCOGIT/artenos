import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCheck, MessageSquare, ExternalLink, Paperclip, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const ArtisanMessagesView: React.FC = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    currentArtisan,
    products,
    navigate,
  } = useMarketplace();

  const [input, setInput] = useState('');
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConv = activeConversation || conversations[0];
  const currentMessages = currentConv ? messages[currentConv.id] || [] : [];
  const linkedProduct = currentConv?.productId
    ? products.find((p) => p.id === currentConv.productId)
    : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentConv]);

  const handleSelectConv = (conv: typeof conversations[0]) => {
    setActiveConversation(conv);
    setMobilePane('chat');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConv) return;
    sendMessage(currentConv.id, input);
    setInput('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Mensagens com Clientes
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Responda dúvidas sobre prazos, cores, tamanhos e confirme personalizações
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EADBCC] shadow-sm h-[600px] sm:h-[650px] flex overflow-hidden">
        {/* Conversations List */}
        <div
          className={`${
            mobilePane === 'chat' ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 border-r border-[#EADBCC] bg-[#FAF6F0] flex-col shrink-0`}
        >
          <div className="p-4 border-b border-[#EADBCC]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E3E19]">
              Clientes Interessados ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#EADBCC]/60">
            {conversations.map((conv) => {
              const isSelected = currentConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`w-full p-4 text-left flex gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-white' : 'hover:bg-white/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#8E3E19] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {conv.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-bold text-[#2D241E] truncate">{conv.clientName}</span>
                      <span className="text-[10px] text-[#8C7667]">{conv.updatedAt}</span>
                    </div>
                    <span className="text-[11px] text-[#8E3E19] font-medium block truncate">
                      {conv.productTitle}
                    </span>
                    <p className="text-xs text-[#6B5A4E] truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        {currentConv ? (
          <div
            className={`${
              mobilePane === 'list' ? 'hidden md:flex' : 'flex'
            } flex-1 flex-col bg-[#FCFAF7] min-w-0`}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 bg-white border-b border-[#EADBCC] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => setMobilePane('list')}
                  className="md:hidden p-1.5 text-[#5C4A3E] hover:text-[#2D241E] rounded-lg hover:bg-[#FAF6F0] cursor-pointer"
                  title="Voltar à lista"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-[#2D241E] truncate">{currentConv.clientName}</h3>
                  <span className="text-[10px] sm:text-xs text-[#8C7667] block">Cliente Comprador(a)</span>
                </div>
              </div>

              {linkedProduct && (
                <button
                  onClick={() => navigate(`/produto/${linkedProduct.id}`)}
                  className="text-[11px] sm:text-xs font-semibold text-[#8E3E19] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="hidden sm:inline">Ver Produto</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Linked Product Banner */}
            {linkedProduct && (
              <div className="bg-[#FAF6F0] px-4 py-2 border-b border-[#EADBCC] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={linkedProduct.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <span className="font-bold text-[#2D241E]">{linkedProduct.title}</span>
                    <span className="text-[11px] text-[#8E3E19] ml-2 font-bold tabular-nums">
                      {formatCurrency(linkedProduct.priceCents)}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#8C7667]">Estoque: {linkedProduct.stock} un.</span>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentMessages.map((msg) => {
                const isMe = msg.senderRole === 'artisan';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#8E3E19] text-[#FAF6F0] rounded-br-xs'
                          : 'bg-white text-[#2D241E] border border-[#EADBCC] rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div
                        className={`mt-1 text-[10px] flex items-center justify-end gap-1 ${
                          isMe ? 'text-white/80' : 'text-[#8C7667]'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#E8D0C0]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies for Artisan */}
            <div className="px-4 py-1.5 bg-[#FAF6F0] border-t border-[#EADBCC] flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[#8C7667] font-semibold whitespace-nowrap">Respostas prontas:</span>
              {[
                'Consigo fazer nessa cor sim! O prazo é de 5 dias úteis.',
                'Perfeito! Já reservei os materiais no meu atelier.',
                'Postarei a encomenda nos Correios amanhã cedo!',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => sendMessage(currentConv.id, chip)}
                  className="bg-white hover:bg-[#FAF6F0] border border-[#D9CDBF] rounded-full px-2.5 py-0.5 text-[#5C4A3E] whitespace-nowrap cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#EADBCC] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Responder ao cliente como artesã..."
                className="flex-1 bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
              <button
                type="submit"
                className="bg-[#8E3E19] hover:bg-[#733113] text-white p-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8 text-xs text-[#8C7667]">
            Selecione uma conversa com cliente para responder
          </div>
        )}
      </div>
    </div>
  );
};
