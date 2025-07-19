import React from 'react'

interface FichaTecnica {
  id: string
  nome: string
  categoria: {
    id: string
    nome: string
  }
  tempoPreparo?: number
  temperaturaForno?: number
  modoPreparo: string
  pesoFinal?: number
  observacoesTecnicas?: string
  nivelDificuldade: string
  versao: number
  ingredientes: Array<{
    id: string
    quantidade: number
    porcentagemPadeiro?: number
    insumo: {
      id: string
      nome: string
      unidade: {
        nome: string
        abreviacao: string
      }
    }
  }>
  createdAt: Date
}

// eslint-disable-next-line react/display-name
const FichaTecnicaPrintView = React.forwardRef<HTMLDivElement, { ficha: FichaTecnica }>(({ ficha }, ref) => {
  return (
    <div ref={ref} className="p-10 bg-white">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{ficha.nome}</h1>
        <p className="text-sm text-gray-500">
          Categoria: {ficha.categoria.nome} | Versão: {ficha.versao} | Data: {new Date(ficha.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </header>

      <section className="grid grid-cols-3 gap-x-8 mb-8 border-t border-b py-4">
        <div>
          <strong className="block text-sm text-gray-600">Tempo de Preparo</strong>
          <p className="text-lg">{ficha.tempoPreparo || 'N/A'} min</p>
        </div>
        <div>
          <strong className="block text-sm text-gray-600">Temperatura do Forno</strong>
          <p className="text-lg">{ficha.temperaturaForno || 'N/A'} °C</p>
        </div>
        <div>
          <strong className="block text-sm text-gray-600">Nível de Dificuldade</strong>
          <p className="text-lg">{ficha.nivelDificuldade}</p>
        </div>
      </section>

      <main className="grid grid-cols-5 gap-x-8">
        <section className="col-span-2">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Ingredientes</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ingrediente</th>
                <th className="text-right py-2">Qtd.</th>
                <th className="text-left py-2 pl-2">Un.</th>
              </tr>
            </thead>
            <tbody>
              {ficha.ingredientes.map((ing, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{ing.insumo.nome}</td>
                  <td className="text-right py-2">{ing.quantidade}</td>
                  <td className="py-2 pl-2">{ing.insumo.unidade.abreviacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="col-span-3">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Modo de Preparo</h2>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: ficha.modoPreparo.replace(/\n/g, '<br />') }}
          />

          {ficha.observacoesTecnicas && (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-4 border-b pb-2">Observações Técnicas</h2>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: ficha.observacoesTecnicas.replace(/\n/g, '<br />') }}
              />
            </>
          )}
        </section>
      </main>
    </div>
  )
})

export default FichaTecnicaPrintView
