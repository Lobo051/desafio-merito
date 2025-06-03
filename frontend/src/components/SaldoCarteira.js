import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define a URL base da API do backend
const API_URL = 'http://localhost:5000/api'; // Ajuste a porta se necessário

function SaldoCarteira({ refreshTrigger }) { // Adiciona refreshTrigger como prop
    const [saldo, setSaldo] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSaldo = async () => {
            setError('');
            try {
                const response = await axios.get(`${API_URL}/carteira/saldo`);
                setSaldo(response.data);
            } catch (err) {
                setError('Erro ao buscar saldo da carteira. Verifique a API.');
                console.error("Erro ao buscar saldo:", err);
                setSaldo(null); // Reseta o saldo em caso de erro
            }
        };

        fetchSaldo();
    }, [refreshTrigger]); // Re-executa quando refreshTrigger mudar

    return (
        <div>
            <h3>Saldo da Carteira</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {saldo === null && !error && <p>Calculando saldo...</p>}
            {saldo !== null && (
                <div>
                    <h4>Saldo Total: R$ {saldo.saldo_total_carteira.toFixed(2)}</h4>
                    {Object.keys(saldo.detalhes_por_fundo).length > 0 && (
                        <div>
                            <h5>Detalhes por Fundo:</h5>
                            <ul>
                                {Object.entries(saldo.detalhes_por_fundo).map(([codigo, detalhes]) => (
                                    <li key={codigo}>
                                        <strong>{codigo}:</strong> Cotas: {detalhes.cotas.toFixed(4)}, 
                                        Valor Cota Atual: R$ {detalhes.valor_cota_atual.toFixed(2)}, 
                                        Saldo Atual: R$ {detalhes.saldo_atual.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SaldoCarteira;

