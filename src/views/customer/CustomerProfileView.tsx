import React, { useState } from 'react';
import { User, Check, ShieldCheck, MapPin, Heart } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

export const CustomerProfileView: React.FC = () => {
  const { customerProfile, updateCustomerProfile } = useMarketplace();

  const [fullName, setFullName] = useState(customerProfile.fullName);
  const [email, setEmail] = useState(customerProfile.email);
  const [phone, setPhone] = useState(customerProfile.phone);
  const [cpf, setCpf] = useState(customerProfile.cpf);

  const [street, setStreet] = useState(customerProfile.address.street);
  const [number, setNumber] = useState(customerProfile.address.number);
  const [complement, setComplement] = useState(customerProfile.address.complement || '');
  const [neighborhood, setNeighborhood] = useState(customerProfile.address.neighborhood);
  const [city, setCity] = useState(customerProfile.address.city);
  const [state, setState] = useState(customerProfile.address.state);
  const [cep, setCep] = useState(customerProfile.address.cep);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
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
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
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

      {savedNotice && (
        <div className="p-4 bg-[#EDF6F1] text-[#1A543E] rounded-2xl text-xs font-semibold border border-[#C5E3D2] flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Perfil e endereço atualizados com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCC] shadow-xs space-y-6">
        {/* Personal info */}
        <div>
          <h2 className="font-serif font-bold text-sm text-[#2D241E] pb-2 border-b border-[#F2EAE0] mb-4">
            Dados Pessoais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">WhatsApp / Celular</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">CPF (Para Nota Fiscal)</label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div>
          <h2 className="font-serif font-bold text-sm text-[#2D241E] pb-2 border-b border-[#F2EAE0] mb-4">
            Endereço Principal de Entrega
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Rua / Logradouro</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Número</label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Complemento</label>
              <input
                type="text"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Bairro</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">CEP</label>
              <input
                type="text"
                required
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          Salvar Dados do Perfil
        </button>
      </form>
    </div>
  );
};
