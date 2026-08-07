"use client";

/* ------------------------------------------------------------------ */
/* HUB DE MAPAS — gemelo digital 2D/3D unificado                       */
/* Fusión de las visualizaciones del Nodo Cero: Mapa 3D (Three.js),    */
/* Mapa SVG soberano (accesible) y Mapa 2D Leaflet. Todos alimentados  */
/* por los mismos datos reales de RDM_POIS.                            */
/* ------------------------------------------------------------------ */

import { useCallback, useState } from "react";
import { Box, Map as MapIcon, FileJson, Layers3 } from "lucide-react";
import { RDM_POIS } from "@/lib/data/rdm-data";
import { Map3DTwin, DEFAULT_MAP_VIEWPORT, type MapMarkerData, type MapViewportState } from "@/components/map/Map3DTwin";
import { TerritorialSVGMap, mapRdmPoisToTerritorial } from "@/components/map/TerritorialSVGMap";
import DigitalTwinMap from "@/components/map/DigitalTwinMap";

type MapMode = "3d" | "svg" | "2d";

const MODES: { id: MapMode; label: string; icon: React.ReactNode }[] = [
  { id: "3d", label: "Mapa 3D", icon: <Box className="w-4 h-4" /> },
  { id: "svg", label: "Mapa Soberano", icon: <Layers3 className="w-4 h-4" /> },
  { id: "2d", label: "Mapa 2D Leaflet", icon: <MapIcon className="w-4 h-4" /> },
];

function markersFromPois(): MapMarkerData[] {
  return RDM_POIS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    description: p.description,
    type: p.category === "gastronomia" || p.category === "plateria" ? "business" : "place",
    isPremium: p.rating >= 4.7,
  }));
}

const MAP_MARKERS = markersFromPois();
const TERRITORIAL_POIS = mapRdmPoisToTerritorial();

export default function MapHub() {
  const [mode, setMode] = useState<MapMode>("3d");
  const [viewport, setViewport] = useState<MapViewportState>(DEFAULT_MAP_VIEWPORT);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);

  const handleViewportChange = useCallback((next: Partial<MapViewportState>) => {
    setViewport((prev) => ({ ...prev, ...next }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-[#082f3b] flex items-center gap-2">
          <Box className="w-6 h-6 text-[#0d4652]" />
          Gemelo Digital 2D/3D · Cartografía Phygital
        </h2>
        <p className="text-xs text-slate-600 font-mono">
          Tres lecturas del mismo territorio: terreno 3D con niebla, mapa soberano accesible y
          cartografía Leaflet en vivo. Todos con los datos reales de RDM_POIS.
        </p>
      </header>

      {/* Selector de modo */}
      <div className="flex items-center gap-2 p-1 rounded-2xl glass-panel border border-white/10 w-fit">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              mode === m.id
                ? "bg-[#0d4652] text-white shadow-md"
                : "text-slate-500 hover:text-[#0d4652]"
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Contenido según modo */}
      {mode === "3d" && (
        <Map3DTwin viewport={viewport} markers={MAP_MARKERS} onViewportChange={handleViewportChange} />
      )}

      {mode === "svg" && (
        <TerritorialSVGMap pois={TERRITORIAL_POIS} selectedId={selectedPoiId} onSelect={setSelectedPoiId} />
      )}

      {mode === "2d" && <DigitalTwinMap />}

      {/* Leyenda compartida */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" /> Minas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Gastronomía
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /> Cultura
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Naturaleza
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Platería
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-slate-400">
          <FileJson className="w-3 h-3" /> {RDM_POIS.length} POIs · fuente: lib/data/rdm-data
        </span>
      </div>
    </div>
  );
}
