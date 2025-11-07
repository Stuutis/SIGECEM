export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="cards-container">
        <div className="card">
          <h2>Doadores</h2>
          <p>124 cadastrados</p>
        </div>

        <div className="card">
          <h2>Famílias</h2>
          <p>87 ativas</p>
        </div>

        <div className="card">
          <h2>Estoque</h2>
          <p>342 itens</p>
        </div>
      </div>
    </div>
  );
}
