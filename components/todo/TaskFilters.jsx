import React from "react";
import { Button } from "@/components/ui/button";

export default function TaskFilters({ activeFilter, onFilterChange, counts }) {
    // Define os 3 filtros disponíveis
    const filters = [
        { value: "all", label: "Todas", count: counts.all },
        { value: "active", label: "Pendentes", count: counts.active },
        { value: "completed", label: "Concluídas", count: counts.completed }
    ];

    return (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {filters.map((filter) => (
                <Button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    className={`rounded-full px-6 whitespace-nowrap transition-all ${
                        activeFilter === filter.value
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                            : 'hover:border-purple-300'
                    }`}
                >
                    {filter.label}
                    {/* Badge com o contador */}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeFilter === filter.value
                            ? 'bg-white/20'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                        {filter.count}
                    </span>
                </Button>
            ))}
        </div>
    );
}
