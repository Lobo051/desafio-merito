import React, { useState } from 'react';
import axios from 'axios';

// Define a URL base da API do backend
// Em um cenário real, isso viria de uma variável de ambiente
const API_URL = 'http://localhost:5000/api'; // Ajuste a porta se necessário

function FundoForm({ onFundoAdicionado }) {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [tipo, setTipo] = useState('');
    const [valorCota, setValorCota] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!nome || !codigo || !tipo || !valorCota) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/fundos`, {
                nome,
                codigo,
                tipo,
                valor_cota: parseFloat(valorCota) // Garante que o valor seja float
            });
            setSuccess(`Fundo '${response.data.nome}' adicionado com sucesso!`);
            // Limpa o formulário
            setNome('');
            setCodigo('');
            setTipo('');
            setValorCota('');
            // Chama a função de callback para atualizar a lista de fundos (se fornecida)
            if (onFundoAdicionado) {
                onFundoAdicionado();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Erro ao adicionar fundo: ${err.response.data.message}`);
            } else {
                setError('Erro ao conectar com a API. Verifique se o backend está rodando.');
            }
            console.error("Erro ao adicionar fundo:", err);
        }
    };

    return (
        <div>
            <h3>Cadastrar Novo Fundo</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                    <label>Código (Ticker):</label>
                    <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                </div>
                <div>
                    <label>Tipo:</label>
                    <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                </div>
                <div>
                    <label>Valor da Cota:</label>
                    <input type="number" step="0.01" value={valorCota} onChange={(e) => setValorCota(e.target.value)} />
                </div>
                <button type="submit">Cadastrar Fundo</button>
            </form>
        </div>
    );
}

export default FundoForm;

