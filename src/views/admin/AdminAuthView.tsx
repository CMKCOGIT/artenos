import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

interface AdminAuthViewProps {
  onSuccess?: () => void;
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({ onSuccess }) => {
  const { login, navigate, setCurrentRole } = useMarketplace();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login({
        email,
        password,
        role: 'admin',
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Credencial de governança validada! Abrindo painel...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate('/admin');
        }, 700);
      } else {
        setErrorMsg(res.error || 'Acesso negado.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Erro ao conectar.');
    }
  };

  return (
    <div className="min-h-screen bg-[#14100E] text-[#E8DCCF] py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      {/* Top back button */}
      <div className="max-w-md w-full mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentRole('customer');
            navigate('/');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-[#A8988B] hover:text-white bg-[#1F1916] px-3 py-1.5 rounded-xl border border-[#3D332D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Vitrine Pública</span>
        </button>

        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Segurança Nível 1</span>
        </span>
      </div>

      <div className="max-w-md w-full bg-[#1F1916] border border-[#3D332D] rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-white">Governança Artenós</h2>
          <p className="text-xs text-[#A8988B]">
            Acesso reservado para supervisores, aprovação de ateliês e auditoria de splits.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#C9BDB0] mb-1">
              E-mail de Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@artenos.com.br"
                className="w-full bg-[#14100E] rounded-xl border border-[#3D332D] pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C9BDB0] mb-1">
              Chave de Acesso / Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Chave master"
                className="w-full bg-[#14100E] rounded-xl border border-[#3D332D] pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Painel de Controle'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
