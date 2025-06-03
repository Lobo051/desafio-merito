import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define a URL base da API do backend
const API_URL = 'http://localhost:5000/api'; // Ajuste a porta se necessário

function MovimentacaoTable({ refreshTrigger }) { // Adiciona refreshTrigger como prop
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovimentacoes = async () => {
            setError('');
            try {
                const response = await axios.get(`${API_URL}/movimentacoes`);
                // A API já retorna ordenado por data descendente
                setMovimentacoes(response.data);
            } catch (err) {
                setError('Erro ao buscar movimentações. Verifique a API.');
                console.error("Erro ao buscar movimentações:", err);
            }
        };

        fetchMovimentacoes();
    }, [refreshTrigger]); // Re-executa quando refreshTrigger mudar

    // Função para formatar data
    const formatarData = (isoString) => {
        if (!isoString) return '';
        try {
            const data = new Date(isoString);
            // Formato DD/MM/YYYY HH:MM:SS
            return data.toLocaleString('pt-BR');
        } catch (e) {
            console.error("Erro ao formatar data:", e);
            return isoString; // Retorna string original em caso de erro
        }
    };

    return (
        <div>
            <h3>Histórico de Movimentações</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {movimentacoes.length === 0 && !error && <p>Nenhuma movimentação registrada ainda.</p>}
            {movimentacoes.length > 0 && (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Fundo</th>
                            <th>Tipo</th>
                            <th>Valor (R$)</th>
                            <th>Cotas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.map(mov => (
                            <tr key={mov.id}>
                                <td>{formatarData(mov.data)}</td>
                                <td>{mov.fundo_codigo}</td>
                                <td style={{ color: mov.tipo === 'aporte' ? 'green' : 'red' }}>
                                    {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)} {/* Capitaliza */} 
                                </td>
                                <td>{mov.valor.toFixed(2)}</td>
                                <td>{mov.quantidade_cotas.toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MovimentacaoTable;

