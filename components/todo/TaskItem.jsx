import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete, isLoading }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                task.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
        >
            {/* Botão de marcar como concluída */}
            <button
                onClick={() => onToggle(task)}
                disabled={isLoading}
                className="flex-shrink-0 transition-transform hover:scale-110"
            >
                {task.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                ) : (
                    <Circle className="w-7 h-7 text-gray-300 group-hover:text-purple-500 transition-colors" />
                )}
            </button>

            {/* Texto da tarefa */}
            <span className={`flex-1 text-lg transition-all ${
                task.completed 
                    ? 'line-through text-gray-400' 
                    : 'text-gray-800'
            }`}>
                {task.title}
            </span>

            {/* Botão de deletar (aparece ao passar o mouse) */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task)}
                disabled={isLoading}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
            >
                <Trash2 className="w-5 h-5" />
            </Button>
        </motion.div>
    );
}
