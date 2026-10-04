import React, { useState } from 'react';
import { User, ShieldCheck, MapPin, Heart, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { addressSchema } from '../../schemas/customer.schema';

export const CustomerProfileView: React.FC = () => {
  const { customerProfile, updateCustomerProfile } = useMarketplace();

  const [fullName, setFullName] = useState(customerProfile.fullName || '');
  const [email, setEmail] = useState(customerProfile.email || '');
  const [phone, setPhone] = useState(customerProfile.phone || '');
  const [cpf, setCpf] = useState(customerProfile.cpf || '');

  const [street, setStreet] = useState(customerProfile.address?.street || '');
  const [number, setNumber] = useState(customerProfile.address?.number || '');
  const [complement, setComplement] = useState(customerProfile.address?.complement || '');
  const [neighborhood, setNeighborhood] = useState(customerProfile.address?.neighborhood || '');
  const [city, setCity] = useState(customerProfile.address?.city || '');
  const [state, setState] = useState(customerProfile.address?.state || '');
  const [cep, setCep] = useState(customerProfile.address?.cep || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCustomerProfile({
      fullName,
      email,
      phone,
      cpf,
      address: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        cep,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Meu Perfil & Preferências
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Gerencie seus dados pessoais e endereço cadastrado para cálculo de frete
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Dados cadastrais e endereço salvos com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCC] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EAE0]">
            <User className="w-4 h-4 text-[#8E3E19]" />
            <h2 className="font-serif font-bold text-base text-[#2D241E]">Dados Pessoais</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Telefone WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CPF (opcional)</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCC] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EAE0]">
            <MapPin className="w-4 h-4 text-[#8E3E19]" />
            <h2 className="font-serif font-bold text-base text-[#2D241E]">Endereço Padrão de Entrega</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Rua / Logradouro</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Rua ou Avenida"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Número</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="123"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Complemento</label>
              <input
                type="text"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto 42"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Bairro</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Bairro"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cidade"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Estado (UF)</label>
              <input
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="SP"
                className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer transition-colors shadow-sm"
        >
          Salvar Dados do Perfil
        </button>
      </form>
    </div>
  );
};
