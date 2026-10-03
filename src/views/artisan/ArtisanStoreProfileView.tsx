import React, { useState } from 'react';
import { Store, Check, ExternalLink, Sparkles, MapPin, Camera } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

export const ArtisanStoreProfileView: React.FC = () => {
  const { currentArtisan, updateArtisanProfile, navigate } = useMarketplace();

  const [studioName, setStudioName] = useState(currentArtisan.studioName);
  const [artisanName, setArtisanName] = useState(currentArtisan.name);
  const [location, setLocation] = useState(currentArtisan.location);
  const [bio, setBio] = useState(currentArtisan.bio);
  const [story, setStory] = useState(currentArtisan.story);
  const [phone, setPhone] = useState(currentArtisan.phone);
  const [instagram, setInstagram] = useState(currentArtisan.instagram);
  const [specialties, setSpecialties] = useState(currentArtisan.specialties.join(', '));
  const [pixKey, setPixKey] = useState(currentArtisan.pixKey || '');

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtisanProfile({
      studioName,
      name: artisanName,
      location,
      bio,
      story,
      phone,
      instagram,
      specialties: specialties.split(',').map((s) => s.trim()),
      pixKey,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Minha Loja & Identidade Pública
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            Configure as informações que os clientes verão ao visitar sua vitrine e histórias
          </p>
        </div>

        <button
          onClick={() => navigate(`/artesa/${currentArtisan.id}`)}
          className="flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-[#F2EAE0] text-[#8E3E19] border border-[#EADBCC] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <span>Visualizar Loja Pública</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 bg-[#EDF6F1] text-[#1A543E] rounded-2xl text-xs font-semibold border border-[#C5E3D2] flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Perfil da sua loja atualizado com sucesso na vitrine pública!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCC] shadow-xs space-y-6">
        {/* Photo & Studio Basics */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#F2EAE0]">
          <div className="relative">
            <img
              src={currentArtisan.avatarUrl}
              alt={currentArtisan.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-[#D9CDBF]"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#8E3E19] text-white p-1.5 rounded-full shadow-xs cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Nome do seu Atelier</label>
                <input
                  type="text"
                  required
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Seu Nome Artístico / Real</label>
                <input
                  type="text"
                  required
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Cidade e Estado (Ex: Caruaru - PE)</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">Instagram (@seuatelier)</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Storytelling */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">
              Biografia Rápida (Exibida nos cartões da vitrine)
            </label>
            <input
              type="text"
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">
              História e Tradição (Como você aprendeu sua arte, família, inspirações)
            </label>
            <textarea
              rows={4}
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5C4A3E] mb-1">
              Especialidades (separadas por vírgula)
            </label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
            />
          </div>
        </div>

        {/* Financial Repasse Key */}
        <div className="pt-4 border-t border-[#F2EAE0]">
          <h2 className="font-serif font-bold text-sm text-[#2D241E] mb-1">
            Chave PIX para Split Automático (90%)
          </h2>
          <p className="text-[11px] text-[#6B5A4E] mb-3">
            O valor de cada venda aprovada é transferido diretamente para essa chave sem intermediários.
          </p>

          <input
            type="text"
            required
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Chave PIX (E-mail, CPF ou Telefone)"
            className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs font-mono text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3.5 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          Salvar Alterações da Minha Loja
        </button>
      </form>
    </div>
  );
};
