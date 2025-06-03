import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define a URL base da API do backend
const API_URL = 'http://localhost:5000/api'; // Ajuste a porta se necessário

function MovimentacaoForm({ onMovimentacaoAdicionada }) {
    const [fundos, setFundos] = useState([]);
    const [fundoSelecionado, setFundoSelecionado] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('aporte'); // 'aporte' ou 'resgate'
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Busca a lista de fundos ao montar o componente
    useEffect(() => {
        const fetchFundos = async () => {
            try {
                const response = await axios.get(`${API_URL}/fundos`);
                setFundos(response.data);
                // Pré-seleciona o primeiro fundo se a lista não estiver vazia
                if (response.data.length > 0) {
                    setFundoSelecionado(response.data[0].id);
                }
            } catch (err) {
                setError('Erro ao buscar lista de fundos. Verifique a API.');
                console.error("Erro ao buscar fundos:", err);
            }
        };
        fetchFundos();
    }, []); // Executa apenas uma vez ao montar

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fundoSelecionado || !valor || !tipo) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/movimentacoes`, {
                fundo_id: parseInt(fundoSelecionado),
                valor: parseFloat(valor),
                tipo: tipo
            });
            setSuccess(`Movimentação (${tipo}) de R$ ${valor} registrada com sucesso para o fundo ${response.data.fundo_codigo}!`);
            // Limpa o formulário
            setValor('');
            // Mantém o fundo e tipo selecionados para facilitar registros múltiplos?
            // setFundoSelecionado(fundos.length > 0 ? fundos[0].id : '');
            // setTipo('aporte');

            // Chama a função de callback para atualizar dados (se fornecida)
            if (onMovimentacaoAdicionada) {
                onMovimentacaoAdicionada();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Erro ao registrar movimentação: ${err.response.data.message}`);
            } else {
                setError('Erro ao conectar com a API. Verifique se o backend está rodando.');
            }
            console.error("Erro ao registrar movimentação:", err);
        }
    };

    return (
        <div>
            <h3>Registrar Movimentação</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Fundo:</label>
                    <select value={fundoSelecionado} onChange={(e) => setFundoSelecionado(e.target.value)} required>
                        <option value="" disabled>Selecione um fundo</option>
                        {fundos.map(fundo => (
                            <option key={fundo.id} value={fundo.id}>
                                {fundo.nome} ({fundo.codigo})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Tipo:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                        <option value="aporte">Aporte</option>
                        <option value="resgate">Resgate</option>
                    </select>
                </div>
                <div>
                    <label>Valor (R$):</label>
                    <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
                </div>
                <button type="submit">Registrar Movimentação</button>
            </form>
        </div>
    );
}

export default MovimentacaoForm;

