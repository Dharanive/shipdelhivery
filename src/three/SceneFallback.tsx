'use client'

import { Box, Truck, Building2, CheckCircle2 } from 'lucide-react'

/**
 * Premium WebGL Fallback Card
 * Rendered when WebGL is unsupported or disabled, matching the stylized
 * white-and-blue miniature logistics aesthetic of the live 3D campus.
 */
export default function SceneFallback() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F8FAFC]"
      role="img"
      aria-label="Stylized isometric miniature logistics facility illustration"
    >
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-white/95 border border-slate-200/90 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center">
        {/* Isometric Stylized Logistics Graphic */}
        <div className="relative w-48 h-40 mb-4 flex items-center justify-center">
          {/* Base Plinth SVG */}
          <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible drop-shadow-md">
            {/* Ground Diroama Slab */}
            <polygon points="100,10 190,55 100,100 10,55" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />
            <polygon points="10,55 100,100 100,120 10,75" fill="#E2E8F0" />
            <polygon points="190,55 100,100 100,120 190,75" fill="#CBD5E1" />

            {/* Asphalt Road Ring */}
            <polygon points="100,28 170,62 100,92 30,58" fill="#334155" />
            <polygon points="100,38 150,62 100,82 50,58" fill="#F8FAFC" />

            {/* Main Super-Hub Building */}
            <polygon points="120,40 160,20 160,50 120,70" fill="#2563EB" />
            <polygon points="120,70 160,50 160,75 120,95" fill="#1D4ED8" />
            <polygon points="80,50 120,70 120,95 80,75" fill="#FFFFFF" stroke="#E2E8F0" />
            {/* White Quad Roof */}
            <polygon points="80,50 120,70 160,50 120,30" fill="#FFFFFF" stroke="#CBD5E1" />

            {/* Delivery Truck */}
            <polygon points="45,65 65,55 65,70 45,80" fill="#0284C7" />
            <polygon points="65,55 85,65 85,80 65,70" fill="#1E40AF" />
          </svg>
        </div>

        {/* Status Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold mb-2">
          <CheckCircle2 size={13} className="text-blue-600" />
          <span>FACILITY ONLINE · 2D ENGINE</span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Interactive Logistics Fleet
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Full shipment tracking, sorting hub telemetry, and network operations are active.
          Hardware 3D acceleration is currently disabled or unsupported.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col items-center gap-1 text-[11px] text-slate-600">
            <Building2 size={15} className="text-blue-600" />
            <span>Smart Hub</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[11px] text-slate-600">
            <Box size={15} className="text-blue-600" />
            <span>Auto Sort</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[11px] text-slate-600">
            <Truck size={15} className="text-blue-600" />
            <span>Fast Fleet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
