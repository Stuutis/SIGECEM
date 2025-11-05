import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>SIGECEM</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/beneficiarios">Beneficiários</Link></li>
        <li><Link to="/doadores">Doadores</Link></li>
        <li><Link to="/familias">Famílias</Link></li>
        <li><Link to="/estoque">Estoque</Link></li>
        <li><Link to="/campanhas">Campanhas</Link></li>
        <li><Link to="/relatorios">Relatórios</Link></li>
      </ul>
    </div>
  )
}
