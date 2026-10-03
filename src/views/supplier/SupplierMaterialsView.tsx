import React, { useState } from 'react';
import { Package, Plus, Trash2, Edit2, Sparkles, Tag, Check, Layers } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency, parseBRLToCents } from '../../utils/formatters';
import { craftPlaceholders } from '../../utils/craftAssets';

export const SupplierMaterialsView: React.FC = () => {
  const {
    supplierMaterials,
    addSupplierMaterial,
    deleteSupplierMaterial,
    supplierCompany,
  } = useMarketplace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Linhas & Fios');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('rolo 500g');
  const [priceBRL, setPriceBRL] = useState('28,50');
  const [stockQty, setStockQty] = useState('50');
  const [batchCode, setBatchCode] = useState('LT-2026-F12');
  const [shadeTone, setShadeTone] = useState('Banho 06 - Terracota Cru Especial');
  const [minOrderQty, setMinOrderQty] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSupplierMaterial({
      supplierId: supplierCompany.id,
      supplierName: supplierCompany.name,
      companyName: supplierCompany.name,
      name,
      category,
      description: description || name,
      priceCents: parseBRLToCents(priceBRL) || 2850,
      unit,
      stockStatus: parseInt(stockQty) > 0 ? 'Em estoque / Pronta entrega' : 'Esgotado',
      stockQty: parseInt(stockQty) || 10,
      location: supplierCompany.location,
      minOrderQty: parseInt(minOrderQty) || 1,
      batchCode,
      shadeTone,
      imageUrl: category.includes('Argila') ? craftPlaceholders.fornecedor_argila : craftPlaceholders.fornecedor_barbante,
    });

    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#122B20]">
            Catálogo de Materiais, Lotes & Tonalidades
          </h1>
          <p className="text-xs text-[#4A6E5D]">
            Cadastre matérias-primas com precisão de lote e banho de cor para que artesãs comprem sem variações de tom
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1A543E] hover:bg-[#123D2C] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Lote / Material</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supplierMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-3xl p-5 border border-[#D2E3DB] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-[#EEF6F2]">
                <img src={mat.imageUrl} alt={mat.description} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#1A543E] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  {mat.category}
                </span>
                <span className="absolute top-2 right-2 bg-white/90 text-[#122B20] text-[9px] font-bold px-2 py-0.5 rounded-md border border-[#D2E3DB]">
                  {mat.stockQty} {mat.unit} disp.
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#122B20] line-clamp-1 mb-1">
                {mat.name || mat.description}
              </h3>
              <p className="text-xs text-[#557567] line-clamp-2 mb-3">
                {mat.description}
              </p>

              {/* Crucial craft batch and shade tone tags */}
              <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#CCE3D7] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#638C7A] font-semibold">Lote Industrial:</span>
                  <span className="font-mono font-bold text-[#1A543E]">{mat.batchCode || '#LT-2026-A1'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#638C7A] font-semibold">Tonalidade / Banho:</span>
                  <span className="font-semibold text-[#122B20]">{mat.shadeTone || 'Natural Padronizado'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E0EFE8] flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-semibold text-[#638C7A] block">Preço Unitário</span>
                <span className="font-bold text-sm text-[#122B20] tabular-nums">
                  {formatCurrency(mat.priceCents)} <span className="text-[10px] text-[#638C7A]">/ {mat.unit}</span>
                </span>
              </div>

              <button
                onClick={() => deleteSupplierMaterial(mat.id)}
                className="text-[#638C7A] hover:text-rose-600 p-1.5 cursor-pointer transition-colors"
                title="Remover material"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CADASTRAR MATERIAL / LOTE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F8FAF9] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#D2E3DB] shadow-2xl my-8">
            <h3 className="text-xl font-bold font-serif text-[#122B20] mb-1">
              Cadastrar Matéria-Prima ou Novo Lote
            </h3>
            <p className="text-xs text-[#557567] mb-4">
              Informe lote e banho de cor com precisão técnica para garantir a padronização das artesãs.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2E25] mb-1">Nome do Insumo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fio Algodão Cru 24 Fios para Macramé"
                  className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E2E25] mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  >
                    <option value="Linhas & Fios">Linhas & Fios</option>
                    <option value="Argilas & Cerâmica">Argilas & Cerâmica</option>
                    <option value="Tecidos & Linho">Tecidos & Linho</option>
                    <option value="Madeiras & Fibras">Madeiras & Fibras</option>
                    <option value="Kits & Aviamentos">Kits & Aviamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2E25] mb-1">Unidade de Medida</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Ex: rolo 500g ou saco 10kg"
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E2E25] mb-1">Preço (R$)</label>
                  <input
                    type="text"
                    required
                    value={priceBRL}
                    onChange={(e) => setPriceBRL(e.target.value)}
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E2E25] mb-1">Qtd Disponível</label>
                  <input
                    type="number"
                    min="1"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E2E25] mb-1">Pedido Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={minOrderQty}
                    onChange={(e) => setMinOrderQty(e.target.value)}
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20] focus:outline-none focus:ring-1 focus:ring-[#1A543E]"
                  />
                </div>
              </div>

              {/* LOTE E TONALIDADE FIELDS */}
              <div className="grid grid-cols-2 gap-3 bg-[#EEF6F2] p-3 rounded-2xl border border-[#CCE3D7]">
                <div>
                  <label className="block text-xs font-bold text-[#1A543E] mb-1">Código do Lote *</label>
                  <input
                    type="text"
                    required
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    placeholder="Ex: #LT-2026-F12"
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#122B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A543E] mb-1">Tonalidade / Banho *</label>
                  <input
                    type="text"
                    required
                    value={shadeTone}
                    onChange={(e) => setShadeTone(e.target.value)}
                    placeholder="Ex: Banho 04 - Terracota"
                    className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-1.5 text-xs text-[#122B20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2E25] mb-1">Descrição Técnica do Material</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Composição das fibras, pureza da argila, secagem..."
                  className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3.5 py-2 text-xs text-[#122B20]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#D2E3DB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#557567] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#1A543E] hover:bg-[#123D2C] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Publicar Lote no Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
