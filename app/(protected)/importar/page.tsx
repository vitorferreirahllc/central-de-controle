import { ImportForm } from "./ImportForm";

export default function ImportarPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Importar relatórios
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Envie o PDF dos relatórios semanais e o sistema lança os resultados
          de Delivery Apps e Meta Ads automaticamente.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">Formato aceito</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Uma seção por cliente, com blocos &quot;Período dd/mm a dd/mm&quot;
            seguidos de Receita, Pedidos, Nota da loja, Investido em anúncios e
            Valor líquido de repasse.
          </li>
          <li>
            Se o bloco trouxer &quot;Meta Ads — valor gasto&quot; e
            &quot;resultados (retorno)&quot;, o Meta Ads também é lançado.
          </li>
          <li>O cliente precisa ser um dos já cadastrados no sistema.</li>
          <li>Contratos ainda não são lidos automaticamente.</li>
        </ul>
      </div>

      <ImportForm />
    </div>
  );
}
