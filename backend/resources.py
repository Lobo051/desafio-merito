from flask import request
from flask_restful import Resource, reqparse
from models import db, Fundo, Movimentacao
from sqlalchemy import func

# Parser para argumentos de Fundo
fundo_parser = reqparse.RequestParser()
fundo_parser.add_argument("nome", type=str, required=True, help="Nome do fundo é obrigatório")
fundo_parser.add_argument("codigo", type=str, required=True, help="Código (ticker) do fundo é obrigatório")
fundo_parser.add_argument("tipo", type=str, required=True, help="Tipo do fundo é obrigatório")
fundo_parser.add_argument("valor_cota", type=float, required=True, help="Valor da cota é obrigatório")

# Parser para argumentos de Movimentacao
movimentacao_parser = reqparse.RequestParser()
movimentacao_parser.add_argument("fundo_id", type=int, required=True, help="ID do fundo é obrigatório")
movimentacao_parser.add_argument("valor", type=float, required=True, help="Valor da movimentação é obrigatório")
movimentacao_parser.add_argument("tipo", type=str, required=True, choices=("aporte", "resgate"), help="Tipo deve ser \'aporte\' ou \'resgate\'")
# A data será definida automaticamente, a quantidade de cotas será calculada

class FundoListResource(Resource):
    def get(self):
        fundos = Fundo.query.all()
        return [{
            "id": fundo.id,
            "nome": fundo.nome,
            "codigo": fundo.codigo,
            "tipo": fundo.tipo,
            "valor_cota": fundo.valor_cota
        } for fundo in fundos]

    def post(self):
        args = fundo_parser.parse_args()
        # Verifica se o código (ticker) já existe
        if Fundo.query.filter_by(codigo=args["codigo"]).first():
            return {"message": f"Fundo com código {args["codigo"]} já existe"}, 400

        fundo = Fundo(
            nome=args["nome"],
            codigo=args["codigo"],
            tipo=args["tipo"],
            valor_cota=args["valor_cota"]
        )
        db.session.add(fundo)
        db.session.commit()
        return {
            "id": fundo.id,
            "nome": fundo.nome,
            "codigo": fundo.codigo,
            "tipo": fundo.tipo,
            "valor_cota": fundo.valor_cota
        }, 201

class FundoResource(Resource):
    def get(self, fundo_id):
        fundo = Fundo.query.get_or_404(fundo_id)
        return {
            "id": fundo.id,
            "nome": fundo.nome,
            "codigo": fundo.codigo,
            "tipo": fundo.tipo,
            "valor_cota": fundo.valor_cota
        }

    def put(self, fundo_id):
        args = fundo_parser.parse_args()
        fundo = Fundo.query.get_or_404(fundo_id)

        # Verifica se o novo código já existe em outro fundo
        existing_fundo = Fundo.query.filter(Fundo.codigo == args["codigo"], Fundo.id != fundo_id).first()
        if existing_fundo:
             return {"message": f"Outro fundo já utiliza o código {args["codigo"]}"}, 400

        fundo.nome = args["nome"]
        fundo.codigo = args["codigo"]
        fundo.tipo = args["tipo"]
        fundo.valor_cota = args["valor_cota"]
        db.session.commit()
        return {
            "id": fundo.id,
            "nome": fundo.nome,
            "codigo": fundo.codigo,
            "tipo": fundo.tipo,
            "valor_cota": fundo.valor_cota
        }

    def delete(self, fundo_id):
        fundo = Fundo.query.get_or_404(fundo_id)
        # Verificar se existem movimentações associadas antes de excluir?
        # Por ora, vamos permitir a exclusão.
        db.session.delete(fundo)
        db.session.commit()
        return {"message": "Fundo excluído com sucesso"}, 200

class MovimentacaoListResource(Resource):
    def get(self):
        movimentacoes = Movimentacao.query.order_by(Movimentacao.data.desc()).all()
        return [{
            "id": mov.id,
            "data": mov.data.isoformat(),
            "valor": mov.valor,
            "tipo": mov.tipo,
            "quantidade_cotas": mov.quantidade_cotas,
            "fundo_id": mov.fundo_id,
            "fundo_codigo": mov.fundo.codigo # Adiciona o código do fundo para clareza
        } for mov in movimentacoes]

    def post(self):
        args = movimentacao_parser.parse_args()
        fundo = Fundo.query.get_or_404(args["fundo_id"])

        valor_movimentacao = args["valor"]
        tipo_movimentacao = args["tipo"]
        valor_cota_atual = fundo.valor_cota

        if valor_cota_atual <= 0:
            return {"message": "Valor da cota do fundo deve ser positivo para realizar movimentações"}, 400

        quantidade_cotas = valor_movimentacao / valor_cota_atual

        # Lógica de validação de resgate (se tem cotas suficientes)
        if tipo_movimentacao == "resgate":
            # Calcula cotas atuais do fundo específico
            cotas_aportadas = db.session.query(func.sum(Movimentacao.quantidade_cotas))\
                                      .filter_by(fundo_id=fundo.id, tipo="aporte").scalar() or 0
            cotas_resgatadas = db.session.query(func.sum(Movimentacao.quantidade_cotas))\
                                       .filter_by(fundo_id=fundo.id, tipo="resgate").scalar() or 0
            cotas_atuais = cotas_aportadas - cotas_resgatadas

            if quantidade_cotas > cotas_atuais:
                return {"message": f"Saldo de cotas insuficiente para resgate. Cotas atuais: {cotas_atuais:.4f}"}, 400
            # Garante que a quantidade de cotas seja negativa no registro de resgate para facilitar o cálculo do saldo
            # quantidade_cotas = -quantidade_cotas # Ou manter positivo e tratar na lógica de saldo?
            # Decisão: Manter positivo e tratar na lógica de saldo/visualização.

        movimentacao = Movimentacao(
            valor=valor_movimentacao,
            tipo=tipo_movimentacao,
            quantidade_cotas=quantidade_cotas,
            fundo_id=fundo.id
        )
        db.session.add(movimentacao)
        db.session.commit()

        return {
            "id": movimentacao.id,
            "data": movimentacao.data.isoformat(),
            "valor": movimentacao.valor,
            "tipo": movimentacao.tipo,
            "quantidade_cotas": movimentacao.quantidade_cotas,
            "fundo_id": movimentacao.fundo_id,
            "fundo_codigo": fundo.codigo
        }, 201

class SaldoCarteiraResource(Resource):
    def get(self):
        saldo_total = 0
        detalhes_fundos = {}

        # 1. Buscar todos os fundos para obter o valor atual da cota
        fundos = Fundo.query.all()
        mapa_valor_cota = {f.id: f.valor_cota for f in fundos}

        # 2. Calcular cotas líquidas por fundo
        movimentacoes = Movimentacao.query.all()
        cotas_por_fundo = {}
        for mov in movimentacoes:
            fundo_id = mov.fundo_id
            if fundo_id not in cotas_por_fundo:
                cotas_por_fundo[fundo_id] = {"cotas": 0, "codigo": mov.fundo.codigo}

            if mov.tipo == "aporte":
                cotas_por_fundo[fundo_id]["cotas"] += mov.quantidade_cotas
            elif mov.tipo == "resgate":
                cotas_por_fundo[fundo_id]["cotas"] -= mov.quantidade_cotas

        # 3. Calcular saldo total e detalhes
        for fundo_id, data in cotas_por_fundo.items():
            cotas_liquidas = data["cotas"]
            valor_cota_atual = mapa_valor_cota.get(fundo_id, 0) # Pega valor atual ou 0 se fundo foi deletado
            saldo_fundo = cotas_liquidas * valor_cota_atual
            saldo_total += saldo_fundo
            detalhes_fundos[data["codigo"]] = {
                "cotas": round(cotas_liquidas, 4),
                "valor_cota_atual": valor_cota_atual,
                "saldo_atual": round(saldo_fundo, 2)
            }

        return {
            "saldo_total_carteira": round(saldo_total, 2),
            "detalhes_por_fundo": detalhes_fundos
        }

