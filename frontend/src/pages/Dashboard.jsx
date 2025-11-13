export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="cards-container">
        <div className="card azul-escuro">
          <h2>Total de Doações</h2>
          <p>1,200</p>
        </div>

        <div className="card verde">
          <h2>Estoque Disponível</h2>
          <p>3,500</p>
        </div>

        <div className="card azul-claro">
          <h2>Famílias Beneficiadas</h2>
          <p>300</p>
        </div>
      </div>
    </div>
  );
}
