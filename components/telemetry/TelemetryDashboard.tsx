"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Activity, Wind, CloudFog, Thermometer, Car, Users, Zap, Shield, RefreshCw } from 'lucide-react';

const telemetryData = [
  { time: '08:00', temp: 11, humidity: 92, traffic: 320, visitors: 1200, energy: 42 },
  { time: '10:00', temp: 13, humidity: 88, traffic: 680, visitors: 3400, energy: 68 },
  { time: '12:00', temp: 15, humidity: 82, traffic: 1240, visitors: 7800, energy: 94 },
  { time: '14:00', temp: 16, humidity: 79, traffic: 1450, visitors: 9200, energy: 88 },
  { time: '16:00', temp: 14, humidity: 85, traffic: 1100, visitors: 6500, energy: 72 },
  { time: '18:00', temp: 12, humidity: 90, traffic: 890, visitors: 4100, energy: 58 },
  { time: '20:00', temp: 10, humidity: 94, traffic: 450, visitors: 2100, energy: 46 },
];

export default function TelemetryDashboard() {
  const [activeMetric, setActiveMetric] = useState<'visitors' | 'traffic' | 'humidity'>('visitors');

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">Visitantes Estimados</div>
            <div className="text-2xl font-black text-white">9,200</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">↑ +24% vs ayer</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">Flujo Vehicular RDM</div>
            <div className="text-2xl font-black text-white">1,450 / hora</div>
            <div className="text-[11px] text-purple-300 font-mono mt-1">Av. Hidalgo Fluida</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">Humedad de la Niebla</div>
            <div className="text-2xl font-black text-white">88%</div>
            <div className="text-[11px] text-amber-300 font-mono mt-1">Niebla ligera en Peñas</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400">
            <CloudFog className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">Eficiencia Energética YUN</div>
            <div className="text-2xl font-black text-white">99.8%</div>
            <div className="text-[11px] text-emerald-300 font-mono mt-1">Nodos en Microgrid</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Chart Section */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Telemetría Territorial en Tiempo Real
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Captura continua de 12 sensores IoT distribuidos en Real del Monte
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setActiveMetric('visitors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeMetric === 'visitors'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aforo Turístico
            </button>
            <button
              onClick={() => setActiveMetric('traffic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeMetric === 'traffic'
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tráfico
            </button>
            <button
              onClick={() => setActiveMetric('humidity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeMetric === 'humidity'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Humedad Niebla
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a101c',
                  borderColor: '#38bdf8',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={
                  activeMetric === 'visitors'
                    ? '#06b6d4'
                    : activeMetric === 'traffic'
                    ? '#a855f7'
                    : '#f59e0b'
                }
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${
                  activeMetric === 'visitors'
                    ? 'cyanGradient'
                    : activeMetric === 'traffic'
                    ? 'purpleGradient'
                    : 'amberGradient'
                })`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* IoT Sensor Health Grid */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Salud de Sensores IoT Distribuidos
          </h3>
          <span className="text-xs font-mono text-emerald-400">12/12 ONLINE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { id: 'MX-01', name: 'Mina Acosta', type: 'Temp · Ocup.', health: 100, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-02', name: 'La Dificultad', type: 'CO₂ · Estruct.', health: 98, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-03', name: 'Panteón Inglés', type: 'Humedad · Viento', health: 100, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-04', name: 'Plaza Principal', type: 'Aforo · Ruido', health: 96, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-05', name: 'Purísima Mirador', type: 'Niebla · Visib.', health: 92, color: 'text-amber-400 border-amber-500/30' },
            { id: 'MX-06', name: 'Peñas Cargadas', type: 'Suelo · Precip.', health: 97, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-07', name: 'El Hiloche', type: 'Biomasa · Aire', health: 99, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-08', name: 'Zelontla', type: 'Seísmo · Vibra', health: 95, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-09', name: 'Zona Minas', type: 'Tráfico', health: 90, color: 'text-amber-400 border-amber-500/30' },
            { id: 'MX-10', name: 'Portal del Paste', type: 'Aforo · Frescura', health: 100, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-11', name: 'Microgrid YUN', type: 'Energía', health: 100, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'MX-12', name: 'Red Comunal', type: 'Edge · Lora', health: 99, color: 'text-emerald-400 border-emerald-500/30' },
          ].map(sensor => (
            <div
              key={sensor.id}
              className={`p-3 rounded-xl bg-slate-950/70 border ${sensor.color} space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">{sensor.id}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs font-bold text-white truncate">{sensor.name}</div>
              <div className="text-[9px] font-mono text-slate-500 truncate">{sensor.type}</div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${
                    sensor.health >= 98 ? 'bg-emerald-400' : sensor.health >= 94 ? 'bg-cyan-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${sensor.health}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
