const pool = require('../database/db')

const registrarSaida = async (req, res) => {

    const { id_familia, itens } = req.body
    const id_usuario = req.userId

    if (!id_familia || !itens || itens.length === 0) {
        return res.status(400).json({ message: 'Familia e lista de produtos são obrigatorios' })
    }

    const connection = await pool.getConnection()

    try {
        await connection.beginTransaction()

        const [resultDist] = await connection.query(
            'INSERT INTO distribuicoes (id_familia, id_usuario) VALUES (?, ?)', [id_familia, id_usuario]
        )

        const id_distribuicao = resultDist.insertId

        for (const item of itens) {
            const [rows] = await connection.query(
                'SELECT quantidade_estoque FROM produtos WHERE id_produto = ?', [item.id_produto]
            )
            if (rows.length === 0) {
                throw new Error(`Produto ID ${item.id_produto} não encontrado`)
            }

            const estoqueAtual = parseFloat(rows[0].quantidade_estoque)
            if (estoqueAtual < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto ID ${item.id_produto}. Disponível: ${estoqueAtual}`)
            }
            // Insere item na distribuição
            await connection.query(
                'INSERT INTO itens_distribuicao (id_distribuicao, id_produto, quantidade) VALUES (?, ?, ?)', [id_distribuicao, item.id_produto, item.quantidade]
            )
            // baixa o estoque
            await connection.query(
                'UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE id_produto = ?', [item.quantidade, item.id_produto]
            )
        }

        await connection.commit()
        res.status(201).json({ message: 'Saida registrada com sucesso', id_distribuicao })

    } catch (error) {
        await connection.rollback()
        console.error(error)
        const status = error.message.includes('Estoque insuficiente') ? 400 : 500
        res.status(status).json({ message: error.message || 'Erro ao registrar saída' })
    } finally {
        connection.release()
    }
}

const listarDistribuicoes = async (req, res) => {
    try {
        const query = `
        SELECT
            d.id_distribuicao,
            d.data_entrega,
            f.nome_responsavel AS familia,
            u.nome AS responsavel_entrega,
            (SELECT SUM(quantidade) FROM itens_distribuicao WHERE id_distribuicao = d.id_distribuicao) AS total_itens
        FROM distribuicoes d
        JOIN familias f ON d.id_familia = f.id_familia
        LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
        ORDER BY d.data_entrega DESC
        `
        const [rows] = await pool.query(query)
        res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao listar distribuições.' })
    }
}

module.exports = { registrarSaida, listarDistribuicoes };