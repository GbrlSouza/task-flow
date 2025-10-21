import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TaskForm({ onSubmit, isLoading }) {
    // Estado local para o texto digitado
    const [title, setTitle] = useState("");

    // Função que roda quando o formulário é enviado
    const handleSubmit = (e) => {
        e.preventDefault(); // Impede reload da página
        if (title.trim()) { // Verifica se não está vazio
            onSubmit({ title: title.trim(), completed: false });
            setTitle(""); // Limpa o campo após adicionar
        }
    };

    return (
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex gap-3">
                {/* Campo de texto */}
                <Input
                    type="text"
                    placeholder="Adicionar nova tarefa..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 h-14 text-lg px-6 rounded-2xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
                    disabled={isLoading}
                />
                
                {/* Botão de adicionar */}
                <Button 
                    type="submit"
                    disabled={!title.trim() || isLoading}
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </div>
        </motion.form>
    );
}
