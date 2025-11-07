export default function Beneficiarios() {
  const data = [
    { nome: "Maria Silva", cpf: "000.111.222-33", visitas: 4 },
    { nome: "João Pereira", cpf: "111.222.333-44", visitas: 2 },
    { nome: "Ana Costa", cpf: "321.654.987-00", visitas: 7 },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Beneficiários</h1>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">CPF</th>
              <th className="p-3">Visitas</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.nome}</td>
                <td className="p-3">{item.cpf}</td>
                <td className="p-3">{item.visitas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
