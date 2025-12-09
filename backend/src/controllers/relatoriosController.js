const pool = require('../database/db');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

/* ============================================================
   DASHBOARD - Usado em api.getDashboard()
============================================================ */
const getDashboard = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM doadores) AS total_doadores,
                (SELECT COUNT(*) FROM familias) AS total_familias,
                (SELECT COALESCE(SUM(quantidade_estoque), 0) FROM produtos) AS itens_estoque,
                (SELECT COUNT(*) FROM campanhas) AS campanhas_ativas
        `);

        return res.json(rows[0]);
    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        return res.status(500).json({ message: "Erro ao carregar dados do dashboard." });
    }
};

/* ============================================================
   RESUMO GERAL - Usado nos relatórios PDF/Excel
============================================================ */
const getResumoGeral = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM doadores) AS total_doadores,
                (SELECT COUNT(*) FROM familias) AS total_familias,
                (SELECT COALESCE(SUM(quantidade_estoque), 0) FROM produtos) AS itens_estoque,
                (SELECT COUNT(*) FROM campanhas) AS campanhas_ativas
        `);

        return res.json(rows[0]);
    } catch (error) {
        console.error("Erro ao obter resumo geral:", error);
        return res.status(500).json({ message: "Erro interno do servidor ao obter resumo geral." });
    }
};

/* ============================================================
   RELATÓRIOS DE DOAÇÕES
============================================================ */
const getRelatorioDoacoes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.nome_produto, SUM(i.quantidade) AS total_doado
            FROM itens_doacao i
            JOIN produtos p ON i.id_produto = p.id_produto
            GROUP BY p.id_produto, p.nome_produto
            ORDER BY p.nome_produto
        `);

        return res.json(rows);
    } catch (error) {
        console.error("Erro ao gerar relatório de doações:", error);
        return res.status(500).json({ message: "Erro ao buscar doações" });
    }
};

/* ============================================================
   RELATÓRIOS DE DISTRIBUIÇÕES
============================================================ */
const getRelatorioDistribuicoes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.nome_produto, SUM(i.quantidade) AS total_distribuido
            FROM itens_distribuicao i
            JOIN produtos p ON i.id_produto = p.id_produto
            GROUP BY p.id_produto, p.nome_produto
            ORDER BY p.nome_produto
        `);

        return res.json(rows);
    } catch (error) {
        console.error("Erro ao gerar relatório de distribuições:", error);
        return res.status(500).json({ message: "Erro ao buscar distribuições" });
    }
};

/* ============================================================
   EXPORTAÇÃO PDF
============================================================ */
const exportPDF = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM doadores) AS total_doadores,
                (SELECT COUNT(*) FROM familias) AS total_familias,
                (SELECT COALESCE(SUM(quantidade_estoque), 0) FROM produtos) AS itens_estoque,
                (SELECT COUNT(*) FROM campanhas) AS campanhas_ativas
        `);

        const data = rows[0];

        const doc = new PDFDocument({ margin: 30 });
        const filename = "resumo_geral.pdf";

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text("Resumo Geral do Sistema", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Total de Doadores: ${data.total_doadores}`);
        doc.text(`Total de Famílias: ${data.total_familias}`);
        doc.text(`Itens em Estoque: ${data.itens_estoque}`);
        doc.text(`Campanhas: ${data.campanhas_ativas}`);

        doc.end();
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).json({ message: "Erro ao gerar PDF" });
    }
};

/* ============================================================
   EXPORTAÇÃO EXCEL
============================================================ */
const exportExcel = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM doadores) AS total_doadores,
                (SELECT COUNT(*) FROM familias) AS total_familias,
                (SELECT COALESCE(SUM(quantidade_estoque), 0) FROM produtos) AS itens_estoque,
                (SELECT COUNT(*) FROM campanhas) AS campanhas_ativas
        `);

        const data = rows[0];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Resumo Geral');

        sheet.columns = [
            { header: 'Métrica', key: 'metrica', width: 25 },
            { header: 'Valor', key: 'valor', width: 15 }
        ];

        sheet.addRow({ metrica: 'Doadores', valor: data.total_doadores });
        sheet.addRow({ metrica: 'Famílias', valor: data.total_familias });
        sheet.addRow({ metrica: 'Itens em Estoque', valor: data.itens_estoque });
        sheet.addRow({ metrica: 'Campanhas', valor: data.campanhas_ativas });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=resumo_geral.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Erro ao gerar Excel:", error);
        res.status(500).json({ message: "Erro ao gerar Excel" });
    }
};

module.exports = { 
    getDashboard,
    getResumoGeral,
    getRelatorioDoacoes,
    getRelatorioDistribuicoes,
    exportPDF,
    exportExcel
};
