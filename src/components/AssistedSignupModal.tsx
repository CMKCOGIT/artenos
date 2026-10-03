import React, { useState } from 'react';
import { X, PhoneCall, Check, Sparkles } from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';

export const AssistedSignupModal: React.FC = () => {
  const { isAssistedSignupOpen, setIsAssistedSignupOpen } = useMarketplace();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bestTime, setBestTime] = useState('Qualquer horário');
  const [craftType, setCraftType] = useState('Crochê & Amigurumi');
  const [submitted, setSubmitted] = useState(false);

  if (!isAssistedSignupOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsAssistedSignupOpen(false);
      setFullName('');
      setPhone('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DCCF] shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-[#F8EFE9] text-[#8E3E19] flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <button
            onClick={() => setIsAssistedSignupOpen(false)}
            className="p-1.5 text-[#8C7667] hover:text-[#2D241E] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold font-serif text-[#2D241E] mb-1">
          Cadastro Assistido & Suporte Humanizado
        </h3>
        <p className="text-xs text-[#6B5A4E] leading-relaxed mb-6">
          Você foca no seu artesanato, nós cuidamos da tecnologia. Nossa equipe parceira entrará em contato via WhatsApp para cadastrar sua loja e tirar fotos sem você pagar nada por isso!
        </p>

        {submitted ? (
          <div className="p-4 bg-[#EDF6F1] text-[#1A543E] rounded-2xl text-xs font-semibold border border-[#C5E3D2] flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0 text-[#1A543E]" />
            <span>Recebido com sucesso! Uma de nossas especialistas entrará em contato no seu WhatsApp no horário escolhido.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Dona Maria do Carmo"
                className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                WhatsApp com DDD *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (81) 99876-5432"
                className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8E3E19]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  O que você produz?
                </label>
                <select
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8E3E19]"
                >
                  <option value="Crochê & Amigurumi">Crochê & Amigurumi</option>
                  <option value="Cerâmica & Barro">Cerâmica & Barro</option>
                  <option value="Bordado & Ponto Cruz">Bordado & Ponto Cruz</option>
                  <option value="Macramê & Fios">Macramê & Fios</option>
                  <option value="Outro Artesanato">Outro Artesanato</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Melhor horário para falar
                </label>
                <select
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8E3E19]"
                >
                  <option value="Qualquer horário">Qualquer horário</option>
                  <option value="Manhã (09h - 12h)">Manhã (09h - 12h)</option>
                  <option value="Tarde (14h - 18h)">Tarde (14h - 18h)</option>
                  <option value="Noite (18h - 20h)">Noite (18h - 20h)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8E3E19] hover:bg-[#733113] text-[#FAF6F0] py-3 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer mt-2"
            >
              Solicitar Contato Gratuito via WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
