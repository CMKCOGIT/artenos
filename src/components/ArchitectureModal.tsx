import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, Download, Shield, Layers, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';
import { architectureSections } from '../data/architectureDocs';
import { COMPLETE_DATABASE_SQL } from '../data/completeDatabaseSql';

export const ArchitectureModal: React.FC = () => {
  const { isArchitectureOpen, setIsArchitectureOpen } = useMarketplace();
  const [activeSectionId, setActiveSectionId] = useState(architectureSections[0].id);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isArchitectureOpen) return null;

  const currentSection = architectureSections.find((s) => s.id === activeSectionId) || architectureSections[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([COMPLETE_DATABASE_SQL], { type: 'application/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'artenos_database_production.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-[#1C1815] text-[#EDE4DA] rounded-3xl w-full max-w-5xl h-[90vh] max-h-[850px] border border-[#3D332B] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#26201B] border-b border-[#3D332B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8E3E19] text-[#FAF6F0] flex items-center justify-center shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#F5EDE3]">
                Blueprint Técnico & Arquitetura — Artenós
              </h2>
              <p className="text-[11px] text-[#A8988B]">
                Documentação Executiva de Engenharia de Software, Modelagem Relacional & Segurança
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSql}
              className="flex items-center gap-1.5 text-xs text-white bg-[#8E3E19] hover:bg-[#A3471D] px-3 py-1.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer"
              title="Baixar artenos_database_production.sql"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar .SQL Completo</span>
              <span className="sm:hidden">.SQL</span>
            </button>

            <button
              onClick={() => setIsArchitectureOpen(false)}
              className="p-2 text-[#A8988B] hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Sidebar and Content */}
        <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-72 bg-[#211B17] border-b md:border-b-0 md:border-r border-[#3D332B] overflow-y-auto p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A8988B] px-3 py-1.5 block">
              Módulos de Arquitetura
            </span>
            {architectureSections.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#8E3E19] text-white shadow-xs'
                      : 'text-[#C9BDB0] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Section Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#8E3E19] bg-[#8E3E19]/10 px-2.5 py-1 rounded-md inline-block mb-1 border border-[#8E3E19]/30">
                ESPECIFICAÇÃO DE ENGENHARIA
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                {currentSection.title}
              </h3>
              <p className="text-xs text-[#A8988B] mt-0.5">{currentSection.subtitle}</p>
            </div>

            {/* Markdown text representation */}
            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-[#D9CDC0] leading-relaxed space-y-4">
              {currentSection.contentMarkdown.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="text-base font-bold text-[#F4E3D5] font-serif pt-2 border-b border-[#3D332B] pb-1">
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h5 key={idx} className="text-sm font-semibold text-[#E5A882] pt-1">
                      {paragraph.replace('#### ', '')}
                    </h5>
                  );
                }
                if (paragraph.startsWith('```text')) {
                  const cleaned = paragraph.replace(/```text\n?/, '').replace(/```$/, '');
                  return (
                    <pre key={idx} className="bg-[#120F0D] p-4 rounded-xl text-xs font-mono text-[#E8D0C0] border border-[#3D332B] overflow-x-auto whitespace-pre">
                      {cleaned}
                    </pre>
                  );
                }
                return (
                  <p key={idx} className="text-xs sm:text-sm text-[#C9BDB0] whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Code Snippet Box (SQL, DDL, RLS) */}
            {currentSection.codeSnippet && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-[#3D332B] bg-[#120F0D]">
                <div className="px-4 py-2.5 bg-[#1C1815] border-b border-[#3D332B] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A8988B] uppercase">
                    {currentSection.codeSnippet.language} (PostgreSQL Supabase)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadSql}
                      className="flex items-center gap-1.5 text-xs text-[#E8D0C0] hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Salvar arquivo .sql localmente"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar .SQL</span>
                    </button>

                    <button
                      onClick={() => handleCopyCode(currentSection.codeSnippet!.code)}
                      className="flex items-center gap-1.5 text-xs text-[#A8988B] hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="p-4 text-xs font-mono text-[#D6CAB8] overflow-x-auto max-h-[380px] leading-relaxed">
                  <code>{currentSection.codeSnippet.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
