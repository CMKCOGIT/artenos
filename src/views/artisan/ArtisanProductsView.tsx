import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Sparkles, Check, AlertTriangle, Eye } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency, parseBRLToCents } from '../../utils/formatters';
import { craftPlaceholders } from '../../utils/craftAssets';
import { Product } from '../../types';

export const ArtisanProductsView: React.FC = () => {
  const {
    products,
    currentArtisan,
    addProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
    navigate,
  } = useMarketplace();

  const artisanProducts = products.filter((p) => p.artisanId === currentArtisan.id);

  // New product modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Crochê & Amigurumi');
  const [priceBRL, setPriceBRL] = useState('120,00');
  const [stock, setStock] = useState('2');
  const [productionDays, setProductionDays] = useState('3');
  const [dimensions, setDimensions] = useState('30 cm x 25 cm');
  const [materials, setMaterials] = useState('Fio de Algodão 100%, Fibra siliconada');
  const [description, setDescription] = useState('');
  const [selectedCraftKey, setSelectedCraftKey] = useState('amigurumi_girafa');

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceBRL, setEditPriceBRL] = useState('');
  const [editStock, setEditStock] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const priceCents = parseBRLToCents(priceBRL) || 12000;

    addProduct({
      title,
      artisanId: currentArtisan.id,
      artisanName: currentArtisan.name,
      artisanLocation: currentArtisan.location,
      artisanAvatar: currentArtisan.avatarUrl,
      category,
      materials: materials.split(',').map((m) => m.trim()),
      dimensions,
      weightGrams: 450,
      stock: parseInt(stock) || 1,
      isCustomizable: true,
      isReadyToShip: parseInt(stock) > 0,
      productionDays: parseInt(productionDays) || 3,
      priceCents,
      description: description || 'Peça artesanal exclusiva produzida com materiais brasileiros.',
      story: currentArtisan.story,
      badge: 'NOVIDADE',
      imageUrl: craftPlaceholders[selectedCraftKey] || craftPlaceholders.amigurumi_girafa,
    });

    setIsAddOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceCents = parseBRLToCents(editPriceBRL) || editingProduct.priceCents;
    const newStock = parseInt(editStock);

    updateProduct(editingProduct.id, {
      priceCents,
      stock: isNaN(newStock) ? editingProduct.stock : newStock,
      isReadyToShip: newStock > 0,
    });

    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Gerenciar Meus Produtos
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            {artisanProducts.length} produtos cadastrados na sua loja
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#8E3E19] hover:bg-[#733113] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisanProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl p-5 border border-[#EADBCC] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-[#FAF6F0]">
                <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#8E3E19] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  {prod.category}
                </span>
                <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-md ${
                  prod.stock > 0 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {prod.stock > 0 ? `${prod.stock} em estoque` : 'Sob Encomenda'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8C7667] mb-1">
                <span>{prod.dimensions}</span>
                <span>{prod.productionDays} dias confecção</span>
              </div>

              <h3 className="font-bold text-sm text-[#2D241E] line-clamp-1 mb-1">
                {prod.title}
              </h3>
              <p className="text-xs text-[#6B5A4E] line-clamp-2">
                {prod.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F2EAE0] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-semibold text-[#8C7667] block">Preço</span>
                  <span className="font-bold text-sm text-[#2D241E] tabular-nums">
                    {formatCurrency(prod.priceCents)}
                  </span>
                </div>

                {/* Stock +/- Buttons */}
                <div className="flex items-center gap-1.5 bg-[#FAF6F0] p-1 rounded-xl border border-[#D9CDBF]">
                  <button
                    onClick={() => updateProductStock(prod.id, prod.stock - 1)}
                    className="w-6 h-6 rounded-lg bg-white text-xs font-bold hover:bg-[#F2EAE0] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold tabular-nums px-1.5">{prod.stock}</span>
                  <button
                    onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                    className="w-6 h-6 rounded-lg bg-white text-xs font-bold hover:bg-[#F2EAE0] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => navigate(`/produto/${prod.id}`)}
                  className="text-[#8C7667] hover:text-[#2D241E] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver na vitrine</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setEditPriceBRL((prod.priceCents / 100).toFixed(2).replace('.', ','));
                      setEditStock(prod.stock.toString());
                    }}
                    className="p-1.5 text-[#8C7667] hover:text-[#8E3E19] cursor-pointer"
                    title="Editar produto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(prod.id)}
                    className="p-1.5 text-[#8C7667] hover:text-[#E11D48] cursor-pointer"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE PRODUCT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#EADBCC] shadow-2xl my-8">
            <h3 className="text-xl font-bold font-serif text-[#2D241E] mb-1">
              Cadastrar Nova Peça Artesanal
            </h3>
            <p className="text-xs text-[#6B5A4E] mb-4">
              Preencha os detalhes para que compradores de todo o Brasil encontrem sua arte.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome da Peça *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Girafa Amigurumi Pipoca"
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  >
                    <option value="Crochê & Amigurumi">Crochê & Amigurumi</option>
                    <option value="Cerâmica">Cerâmica</option>
                    <option value="Bordado">Bordado</option>
                    <option value="Macramê">Macramê</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Preço de Venda (R$)</label>
                  <input
                    type="text"
                    required
                    value={priceBRL}
                    onChange={(e) => setPriceBRL(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs font-bold text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Dias Confecção</label>
                  <input
                    type="number"
                    min="1"
                    value={productionDays}
                    onChange={(e) => setProductionDays(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Dimensões</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="30 cm x 20 cm"
                    className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Materiais Utilizados</label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Fio de Algodão, Argila natural..."
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Descrição & Afeto da Peça</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte os detalhes da criação..."
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E]"
                />
              </div>

              {/* Photo Style Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Foto da Peça</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'amigurumi_girafa', label: 'Amigurumi' },
                    { key: 'ceramica_vaso', label: 'Cerâmica' },
                    { key: 'bordado_bastidor', label: 'Bordado' },
                    { key: 'painel_macrame', label: 'Macramê' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedCraftKey(item.key)}
                      className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedCraftKey === item.key
                          ? 'border-[#8E3E19] bg-[#F8EFE9] ring-2 ring-[#8E3E19]'
                          : 'border-[#D9CDBF] bg-white'
                      }`}
                    >
                      <img src={craftPlaceholders[item.key]} alt="" className="w-full h-12 object-cover rounded-lg mb-1" />
                      <span className="text-[10px] font-bold text-[#2D241E]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EADBCC]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B5A4E] hover:text-[#2D241E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#8E3E19] hover:bg-[#733113] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Publicar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-3xl p-6 max-w-md w-full border border-[#EADBCC] shadow-2xl">
            <h3 className="text-lg font-bold font-serif text-[#2D241E] mb-1">
              Editar {editingProduct.title}
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Preço de Venda (R$)</label>
                <input
                  type="text"
                  required
                  value={editPriceBRL}
                  onChange={(e) => setEditPriceBRL(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs font-bold text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Estoque Físico</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#D9CDBF] px-3.5 py-2 text-xs text-[#2D241E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADBCC]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B5A4E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#8E3E19] hover:bg-[#733113] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
