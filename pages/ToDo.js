import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { CheckSquare } from "lucide-react";
import TaskForm from "../components/todo/TaskForm";
import TaskItem from "../components/todo/TaskItem";
import TaskFilters from "../components/todo/TaskFilters";

export default function ToDoPage() {
    // Estado para controlar qual filtro está ativo
    const [filter, setFilter] = useState("all");
    const queryClient = useQueryClient();

    // BUSCAR tarefas do banco de dados
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => base44.entities.Task.list("-created_date"),
    });

    // CRIAR nova tarefa
    const createMutation = useMutation({
        mutationFn: (taskData) => base44.entities.Task.create(taskData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    // ATUALIZAR tarefa existente
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    // DELETAR tarefa
    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Task.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    // Função que inverte o status completed da tarefa
    const handleToggle = (task) => {
        updateMutation.mutate({ 
            id: task.id, 
            data: { completed: !task.completed } 
        });
    };

    // Filtra tarefas baseado no filtro ativo
    const filteredTasks = tasks.filter(task => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true; // "all" mostra todas
    });

    // Calcula contadores para os filtros
    const counts = {
        all: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length
    };

    // Verifica se alguma operação está em andamento
    const isProcessing = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
                {/* CABEÇALHO */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <CheckSquare className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Minhas Tarefas
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Organize seu dia com facilidade
                    </p>
                </div>

                {/* FORMULÁRIO para adicionar tarefa */}
                <TaskForm 
                    onSubmit={createMutation.mutate}
                    isLoading={isProcessing}
                />

                {/* FILTROS */}
                <TaskFilters 
                    activeFilter={filter}
                    onFilterChange={setFilter}
                    counts={counts}
                />

                {/* LISTA DE TAREFAS */}
                <div className="space-y-3">
                    {isLoading ? (
                        // Carregando...
                        <div className="text-center py-12">
                            <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 mt-4">Carregando tarefas...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        // Lista vazia
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <CheckSquare className="w-12 h-12 text-gray-300" />
                            </div>
                            <p className="text-xl text-gray-400 font-medium">
                                {filter === "completed" 
                                    ? "Nenhuma tarefa concluída ainda"
                                    : filter === "active"
                                    ? "Nenhuma tarefa pendente! 🎉"
                                    : "Adicione sua primeira tarefa"}
                            </p>
                        </div>
                    ) : (
                        // Lista com tarefas
                        <AnimatePresence>
                            {filteredTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggle}
                                    onDelete={(task) => deleteMutation.mutate(task.id)}
                                    isLoading={isProcessing}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* RODAPÉ com estatísticas */}
                {tasks.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        {counts.completed} de {counts.all} tarefas concluídas
                    </div>
                )}
            </div>
        </div>
    );
}
