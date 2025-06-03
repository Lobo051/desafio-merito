import React, { useState } from 'react';
import './App.css';
import FundoForm from './components/FundoForm';
import MovimentacaoForm from './components/MovimentacaoForm';
import MovimentacaoTable from './components/MovimentacaoTable';
import SaldoCarteira from './components/SaldoCarteira';

function App() {
    // Estado para forçar a atualização dos componentes que dependem de dados atualizados
    // Incrementamos este valor sempre que uma ação (cadastro, movimentação) é realizada com sucesso
    const [refreshKey, setRefreshKey] = useState(0);

    const handleDataUpdate = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Dashboard de Investimentos</h1>
            </header>
            <main>
                {/* Seção de Saldo da Carteira - Atualiza com refreshKey */}
                <section>
                    <SaldoCarteira refreshTrigger={refreshKey} />
                </section>

                <hr />

                {/* Seção de Cadastro de Fundo - Atualiza a lista de fundos no MovimentacaoForm indiretamente */}
                <section>
                    <FundoForm onFundoAdicionado={handleDataUpdate} />
                </section>

                <hr />

                {/* Seção de Registro de Movimentação - Atualiza Saldo e Tabela */}
                <section>
                    {/* Passamos refreshKey para MovimentacaoForm recarregar a lista de fundos se necessário */}
                    {/* E onMovimentacaoAdicionada para atualizar Saldo e Tabela */}
                    <MovimentacaoForm onMovimentacaoAdicionada={handleDataUpdate} refreshTrigger={refreshKey} />
                </section>

                <hr />

                {/* Seção de Histórico de Movimentações - Atualiza com refreshKey */}
                <section>
                    <MovimentacaoTable refreshTrigger={refreshKey} />
                </section>
            </main>
            <footer>
                <p>Desafio Fullstack Mérito</p>
            </footer>
        </div>
    );
}

export default App;

