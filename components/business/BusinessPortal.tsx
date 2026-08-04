"use client";

import React, { useState } from 'react';
import { Store, Search, Star, MapPin, ChevronRight } from 'lucide-react';
import { RDM_BUSINESSES, RDMBusiness } from '@/lib/data/rdm-tourism';

const categoryLabels: Record<string, string> = {
  paste: 'Pastes',
  plateria: 'Platería',
  cafe: 'Café',
  artesania: 'Artesanías',
  restaurante: 'Restaurantes',
  hotel: 'Hospedajes',
  panaderia: 'Panaderías',
  heladeria: 'Heladerías',
};

const categoryColors: Record<string, string> = {
  paste: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
  plateria: 'text-slate-200 border-slate-400/40 bg-slate-900/60',
  cafe: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
  artesania: 'text-violet-300 border-violet-500/40 bg-violet-950/60',
  restaurante: 'text-rose-300 border-rose-500/40 bg-rose-950/60',
  hotel: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60',
  panaderia: 'text-orange-300 border-orange-500/40 bg-orange-950/60',
  heladeria: 'text-purple-300 border-purple-500/40 bg-purple-950/60',
};

export default function BusinessPortal() {
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<RDMBusiness | null>(null);

  const filtered = RDM_BUSINESSES.filter(b => {
    const matchCat = filter === 'all' || b.category === filter;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || b.name.toLowerCase().includes(q) || b.area.toLowerCase().includes(q) || categoryLabels[b.category].toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-400" />
            Portal de Comercios del Real
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Directorio soberano de comercios locales · Sello RDM verificado
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, categoría o zona..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {[['all', 'Todo'], ...Object.entries(categoryLabels)].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                filter === id ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(business => (
          <button
            key={business.id}
            onClick={() => setSelected(business)}
            className="group p-5 rounded-2xl glass-panel-interactive border border-white/10 text-left space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${categoryColors[business.category]}`}>
                  {categoryLabels[business.category]}
                </span>
                <h3 className="text-base font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                  {business.name}
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {business.rating}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">{business.description}</p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {business.area}
              </span>
              <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver ficha
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-10 text-center rounded-2xl glass-panel border border-white/10">
          <p className="text-sm text-slate-400 font-mono">Sin resultados para «{query}»</p>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md p-6 glass-panel rounded-2xl border border-amber-500/40 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${categoryColors[selected.category]}`}>
                {categoryLabels[selected.category]}
              </span>
              <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {selected.rating}
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{selected.name}</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">{selected.description}</p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Zona: {selected.area}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white font-bold text-xs transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
