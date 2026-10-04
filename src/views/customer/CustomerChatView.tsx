import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, CheckCheck, Check, MessageSquare, ExternalLink, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { StorageService } from '../../services/storage.service';

export const CustomerChatView: React.FC = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    products,
    navigate,
  } = useMarketplace();

  const [input, setInput] = useState('');
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentConv = activeConversation || (conversations.length > 0 ? conversations[0] : null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentConv) return;
    const res = await StorageService.uploadFile('chat-attachments', file);
    if (res.success && res.url) {
      sendMessage(currentConv.id, `[Anexo / Imagem]: ${res.url}`);
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Minhas Mensagens
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            Converse diretamente com as artesãs para tirar dúvidas e negociar personalizações
          </p>
        </div>

        <EmptyState
          icon={MessageSquare}
          title="Você ainda não possui conversas"
          description="Você pode iniciar uma conversa direta com qualquer artesã na página do produto para tirar dúvidas sobre materiais, prazos e personalizações sob medida."
          actionText="Explorar Vitrine de Peças"
          onAction={() => navigate('/produtos')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Minhas Mensagens
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Converse diretamente com as artesãs para tirar dúvidas e negociar personalizações
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EADBCC] shadow-sm h-[600px] sm:h-[650px] flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div
          className={`${
            mobilePane === 'chat' ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 border-r border-[#EADBCC] bg-[#FAF6F0] flex-col shrink-0`}
        >
          <div className="p-4 border-b border-[#EADBCC]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E3E19]">
              Conversas ({conversations.length})
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
                  <img
                    src={conv.artisanAvatar}
                    alt={conv.artisanName}
                    className="w-11 h-11 rounded-full object-cover border border-[#D9CDBF] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-bold text-[#2D241E] truncate">{conv.artisanName}</span>
                      <span className="text-[10px] text-[#8C7667]">{conv.updatedAt}</span>
                    </div>
                    {conv.productTitle && (
                      <span className="text-[11px] font-semibold text-[#8E3E19] truncate block mb-0.5">
                        peça: {conv.productTitle}
                      </span>
                    )}
                    <p className="text-xs text-[#6B5A4E] truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages Pane */}
        {currentConv ? (
          <div
            className={`${
              mobilePane === 'list' ? 'hidden md:flex' : 'flex'
            } flex-1 flex-col bg-white overflow-hidden`}
          >
            {/* Top Bar */}
            <div className="p-3.5 sm:p-4 border-b border-[#EADBCC] bg-[#FAF6F0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobilePane('list')}
                  className="md:hidden p-1.5 rounded-lg text-[#8C7667] hover:text-[#2D241E] hover:bg-white/60"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={currentConv.artisanAvatar}
                  alt={currentConv.artisanName}
                  className="w-10 h-10 rounded-full object-cover border border-[#D9CDBF]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#2D241E] leading-tight">
                    {currentConv.artisanName}
                  </h3>
                  <span className="text-[11px] text-[#1A543E] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A543E]" />
                    Online
                  </span>
                </div>
              </div>

              {linkedProduct && (
                <div
                  onClick={() => navigate(`/produto/${linkedProduct.id}`)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 bg-white rounded-xl border border-[#EADBCC] cursor-pointer hover:border-[#8E3E19] transition-colors"
                >
                  <img
                    src={linkedProduct.imageUrl}
                    alt={linkedProduct.title}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#2D241E] truncate block max-w-32">
                      {linkedProduct.title}
                    </span>
                    <span className="text-[10px] text-[#8E3E19] font-bold">
                      {formatCurrency(linkedProduct.priceCents)}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#8C7667]" />
                </div>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FAF8F5]">
              {currentMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-[#8C7667]">
                  Inicie uma conversa digitando abaixo.
                </div>
              ) : (
                currentMessages.map((msg) => {
                  const isMe = msg.senderRole === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#8E3E19] text-white rounded-br-xs'
                            : 'bg-white text-[#2D241E] border border-[#EADBCC] rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#8C7667] mt-1 px-1">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#8E3E19]" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#EADBCC] bg-white flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#8C7667] hover:text-[#2D241E] rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                title="Anexar foto ou arquivo"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva sua mensagem para a artesã..."
                className="flex-1 bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[#8E3E19] hover:bg-[#733113] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8C7667]">
            Selecione uma conversa para visualizar as mensagens.
          </div>
        )}
      </div>
    </div>
  );
};
