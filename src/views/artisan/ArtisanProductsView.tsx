import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Sparkles, X, Image as ImageIcon, Eye, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency, parseBRLToCents } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { structuralCategories } from '../../data/categoriesData';
import { productSchema } from '../../schemas/product.schema';
import { Product } from '../../types';

export const ArtisanProductsView: React.FC = () => {
  const {
    products,
    currentArtisan,
    addProduct,
    updateProduct,
    deleteProduct,
    navigate,
    currentRoute,
  } = useMarketplace();

  const artisanProducts = currentArtisan
    ? products.filter((p) => p.artisanId === currentArtisan.id)
    : products;

  // New product modal state - auto-opens if route is /artesa/produtos/novo
  const [isAddOpen, setIsAddOpen] = useState(() => currentRoute === '/artesa/produtos/novo');
  const [successBanner, setSuccessBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  React.useEffect(() => {
    if (currentRoute === '/artesa/produtos/novo') {
      setIsAddOpen(true);
    }
  }, [currentRoute]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cerâmica & Barro');
  const [priceBRL, setPriceBRL] = useState('');
  const [stock, setStock] = useState('1');
  const [weightGrams, setWeightGrams] = useState('500');
  const [widthCm, setWidthCm] = useState('20');
  const [heightCm, setHeightCm] = useState('15');
  const [lengthCm, setLengthCm] = useState('20');
  const [productionDays, setProductionDays] = useState('2');
  const [materials, setMaterials] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPending, setShowPending] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setImagePreview(fakeUrl);
      setImageUrl(fakeUrl);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const priceNumber = parseFloat(priceBRL.replace(/\./g, '').replace(',', '.')) || 0;
    const dimensionsStr = `${widthCm}cm x ${heightCm}cm x ${lengthCm}cm`;

    const validation = productSchema.safeParse({
      title,
      category,
      price: priceNumber,
      stock: parseInt(stock) || 0,
      description,
      materials: materials || 'Materiais naturais certificados',
      dimensions: dimensionsStr,
      weightGrams: parseInt(weightGrams) || 500,
      productionDays: parseInt(productionDays) || 1,
      isCustomizable,
      isReadyToShip: (parseInt(stock) || 0) > 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    });

    if (!validation.success) {
      const errs: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errs[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errs);
      return;
    }

    setIsAddOpen(false);

    const res = await addProduct({
      title,
      artisanId: currentArtisan?.id || 'artisan-current',
      artisanName: currentArtisan?.name || 'Mestra Artesã',
      artisanLocation: currentArtisan?.location || 'Brasil',
      artisanAvatar: currentArtisan?.avatarUrl || '',
      category,
      materials: materials.split(',').map((m) => m.trim()),
      dimensions: dimensionsStr,
      weightGrams: parseInt(weightGrams) || 500,
      stock: parseInt(stock) || 0,
      isCustomizable,
      isReadyToShip: (parseInt(stock) || 0) > 0,
      productionDays: parseInt(productionDays) || 1,
      priceCents: Math.round(priceNumber * 100),
      description,
      story: currentArtisan?.story || '',
      badge: 'NOVIDADE',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    });

    if (res.success) {
      setSuccessBanner(res.message);
      setErrorBanner('');
    } else {
      setErrorBanner(res.message);
      setSuccessBanner('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Gerenciar Meus Produtos
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            {artisanProducts.length} peças cadastradas na sua loja
          </p>
        </div>

        <button
          onClick={() => {
            navigate('/artesa/produtos/novo');
            setIsAddOpen(true);
            setFormErrors({});
          }}
          className="bg-[#8E3E19] hover:bg-[#733113] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Primeiro Produto</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner('')} className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorBanner && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner('')} className="text-red-700 hover:text-red-950 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {artisanProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum produto cadastrado ainda"
          description="Comece a expor suas peças e alcance compradores em todo o Brasil. O formulário conta com cálculo dimensional para frete e regras de precificação justa."
          actionText="Cadastrar primeiro produto"
          onAction={() => {
            navigate('/artesa/produtos/novo');
            setIsAddOpen(true);
            setFormErrors({});
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisanProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#EADBCC] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-[#FAF6F0]">
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#8E3E19] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                    {prod.category}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-sm text-[#2D241E]">{prod.title}</h3>
                  <p className="text-xs text-[#6B5A4E] line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#F2EAE0] flex items-center justify-between mt-2">
                <span className="font-bold text-sm text-[#2D241E] tabular-nums">
                  {formatCurrency(prod.priceCents)}
                </span>
                <span className="text-xs text-[#8C7667]">Estoque: {prod.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Product Form Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#EADBCC] shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2D241E]">
                  Cadastrar Nova Peça
                </h3>
                <p className="text-xs text-[#6B5A4E]">
                  Preencha os detalhes dimensionais e de confecção da sua obra
                </p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-[#8C7667] hover:text-[#2D241E] rounded-xl hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Nome da Peça *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Vaso Terracota Queimado com Alças"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.title && <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.title}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Categoria de Artesanato *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  >
                    {structuralCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    value={priceBRL}
                    onChange={(e) => setPriceBRL(e.target.value)}
                    placeholder="Ex: 150,00"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                  {formErrors.price && <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.price}</span>}
                </div>
              </div>

              {/* Dimensional Logistics (Correios / Melhor Envio) */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19] block">
                  Logística & Dimensões para Frete
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3B32] mb-1">Peso (gramas) *</label>
                    <input
                      type="number"
                      required
                      value={weightGrams}
                      onChange={(e) => setWeightGrams(e.target.value)}
                      placeholder="500"
                      className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3B32] mb-1">Largura (cm) *</label>
                    <input
                      type="number"
                      required
                      value={widthCm}
                      onChange={(e) => setWidthCm(e.target.value)}
                      placeholder="20"
                      className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3B32] mb-1">Altura (cm) *</label>
                    <input
                      type="number"
                      required
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="15"
                      className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4A3B32] mb-1">Comprimento (cm) *</label>
                    <input
                      type="number"
                      required
                      value={lengthCm}
                      onChange={(e) => setLengthCm(e.target.value)}
                      placeholder="20"
                      className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Estoque Físico Pronta Entrega
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                    Prazo de Confecção se Sob Encomenda (dias)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productionDays}
                    onChange={(e) => setProductionDays(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Materiais Utilizados *
                </label>
                <input
                  type="text"
                  required
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Ex: Argila natural, esmalte mineral atóxico, queima a 1240°C"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Descrição da Peça *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a utilidade, acabamento e inspiração da sua peça..."
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl p-3 text-xs text-[#2D241E]"
                />
                {formErrors.description && <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.description}</span>}
              </div>

              {/* Image Preview & Upload Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Foto da Peça *
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#FAF7F2] border border-[#D9CDBF] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#8C7667]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#D9CDBF] px-4 py-2 rounded-xl text-xs font-semibold text-[#2D241E] cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#8E3E19]" />
                      <span>Selecionar Imagem do Dispositivo</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <p className="text-[10px] text-[#8C7667] mt-1">PNG, JPG ou WEBP até 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2EAE0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B5A4E] hover:bg-[#FAF7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#8E3E19] hover:bg-[#733113] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
