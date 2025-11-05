export default function Estoque() {
  const data = [
    { item: "Arroz 5kg", quantidade: 12 },
    { item: "Macarrão", quantidade: 45 },
    { item: "Leite em pó", quantidade: 8 },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Estoque</h1>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Quantidade</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.item}</td>
                <td className="p-3">{item.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
