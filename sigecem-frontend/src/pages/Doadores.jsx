export default function Doacoes() {
  const data = [
    { item: "Arroz 5kg", doador: "Carlos", data: "05/09/2025" },
    { item: "Macarrão", doador: "Pedro", data: "02/09/2025" },
    { item: "Feijão", doador: "Maria", data: "01/09/2025" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doações</h1>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Doador</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.item}</td>
                <td className="p-3">{item.doador}</td>
                <td className="p-3">{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
