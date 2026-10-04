import React, { useState } from 'react';
import { Building2, Check, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const SupplierCompanyView: React.FC = () => {
  const { supplierCompany, updateSupplierCompany, notifyPendingIntegration } = useMarketplace();

  const [name, setName] = useState(supplierCompany.name || '');
  const [description, setDescription] = useState(supplierCompany.description || '');
  const [category, setCategory] = useState(supplierCompany.category || '');
  const [location, setLocation] = useState(supplierCompany.location || '');
  const [phone, setPhone] = useState(supplierCompany.phone || '');
  const [email, setEmail] = useState(supplierCompany.email || '');
  const [cnpj, setCnpj] = useState(supplierCompany.cnpj || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupplierCompany({
      name,
      description,
      category,
      location,
      phone,
      email,
      cnpj,
    });
    notifyPendingIntegration(
      'Atualização da Empresa Fornecedora',
      `Dados da empresa "${name || 'Empresa'}" validados no formulário. A persistência dos dados cadastrais será concluída com o Supabase.`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#122B20]">
          Cadastro da Minha Empresa
        </h1>
        <p className="text-xs text-[#4A6E5D]">
          Dados institucionais visíveis para artesãs e ateliês que buscam fornecedores homologados
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D2E3DB] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E0EFE8]">
          <div className="w-12 h-12 rounded-2xl bg-[#1A543E] text-white flex items-center justify-center font-bold text-lg">
            {name ? name.charAt(0).toUpperCase() : 'F'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-[#122B20]">{name || 'Minha Empresa Fornecedora'}</h2>
              <span className="bg-[#E0EFE8] text-[#1A543E] px-2 py-0.5 rounded-full text-[10px] font-bold">
                {supplierCompany.verified ? '✓ Homologado' : 'Aguardando Banco'}
              </span>
            </div>
            <p className="text-xs text-[#557567]">CNPJ: {cnpj || 'Não informado'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1E2E25] mb-1">Razão Social / Nome Fantasia</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2E25] mb-1">CNPJ</label>
            <input
              type="text"
              required
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2E25] mb-1">Ramo de Atuação / Categoria</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2E25] mb-1">Cidade e Estado (Polo Fabril)</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2E25] mb-1">Telefone Comercial / WhatsApp</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2E25] mb-1">E-mail Comercial B2B</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1E2E25] mb-1">Apresentação da Indústria / Beneficiamento</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#1A543E] hover:bg-[#123D2C] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          Salvar Dados da Empresa
        </button>
      </form>
    </div>
  );
};
