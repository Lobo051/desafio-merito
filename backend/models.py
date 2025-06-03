from app import db
from datetime import datetime

class Fundo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    codigo = db.Column(db.String(20), unique=True, nullable=False) # Ticker
    tipo = db.Column(db.String(50), nullable=False)
    valor_cota = db.Column(db.Float, nullable=False)
    movimentacoes = db.relationship("Movimentacao", backref="fundo", lazy=True)

    def __repr__(self):
        return f"<Fundo {self.codigo}>"

class Movimentacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    valor = db.Column(db.Float, nullable=False)
    tipo = db.Column(db.String(10), nullable=False) # "aporte" ou "resgate"
    quantidade_cotas = db.Column(db.Float, nullable=False)
    fundo_id = db.Column(db.Integer, db.ForeignKey("fundo.id"), nullable=False)

    def __repr__(self):
        return f"<Movimentacao {self.id} - {self.tipo} - {self.valor}>"

# O saldo da carteira e a quantidade de cotas por fundo serão calculados dinamicamente
# através das movimentações, não necessitando de um modelo "Carteira" separado por enquanto.

