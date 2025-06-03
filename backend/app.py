from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app) # Habilita CORS para todas as rotas

# Importar modelos e recursos depois de inicializar db e api para evitar importações circulares
from models import Fundo, Movimentacao # Adicionar Carteira se/quando criada
from resources import FundoResource, FundoListResource, MovimentacaoListResource, SaldoCarteiraResource

# Configuração das rotas da API
api.add_resource(FundoListResource, 
                 '/api/fundos')
api.add_resource(FundoResource,
                 '/api/fundos/<int:fundo_id>')
api.add_resource(MovimentacaoListResource,
                 '/api/movimentacoes')
api.add_resource(SaldoCarteiraResource,
                 '/api/carteira/saldo')

if __name__ == '__main__':
    # Executar dentro do contexto da aplicação para que o SQLAlchemy funcione corretamente
    with app.app_context():
        db.create_all() # Cria as tabelas se não existirem (bom para SQLite inicial)
    app.run(debug=True, host='0.0.0.0') # Escuta em todas as interfaces

