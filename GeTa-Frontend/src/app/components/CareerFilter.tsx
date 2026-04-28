import React from 'react';
import { CAREERS } from '../data/mockData';
import { BookOpen, Check } from 'lucide-react';
import { cn } from './ui/utils';

interface CareerFilterProps {
  selectedCareer: string;
  onSelectCareer: (career: string) => void;
}

export const CareerFilter: React.FC<CareerFilterProps> = ({ selectedCareer, onSelectCareer }) => {
  const allCareers = ['Todas las Carreras', ...CAREERS];

  return (
    <div className="bg-[#FFD100] rounded-lg shadow-lg border-2 border-[#FFD100] p-4 sticky top-20">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#003DA5]/20">
        <BookOpen className="h-5 w-5 text-[#003DA5]" />
        <h3 className="font-semibold text-[#003DA5]">Filtrar por Carrera</h3>
      </div>
      
      <div className="space-y-1">
        {allCareers.map((career) => (
          <button
            key={career}
            onClick={() => onSelectCareer(career)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group",
              selectedCareer === career
                ? "bg-[#003DA5] text-white shadow-md"
                : "hover:bg-white/50 text-[#003DA5] font-medium"
            )}
          >
            <span className={cn(
              "line-clamp-2",
              selectedCareer === career ? "font-medium" : ""
            )}>
              {career}
            </span>
            {selectedCareer === career && (
              <Check className="h-4 w-4 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#003DA5]/20">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-[#003DA5] font-medium">
            💡 Tip: Selecciona tu carrera para ver publicaciones relevantes
          </p>
        </div>
      </div>
    </div>
  );
};