import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportarExcel(listaUTs) {

  const dados = listaUTs.map((ut) => ({

    "Número da UT": ut.numeroUT,

    "Nome da Unidade": ut.nomeUT,

    Cliente: ut.cliente,

    Cidade: ut.cidade,

    Estado: ut.estado,

    "Última Revisão": ut.ultimaRevisao,

    "Próxima Revisão": ut.proximaRevisao,

    Periodicidade: `${ut.periodicidade} meses`,

  }));

  const planilha = XLSX.utils.json_to_sheet(dados);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    planilha,
    "Unidades"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const arquivo = new Blob(
    [excelBuffer],
    {
      type: "application/octet-stream",
    }
  );

  saveAs(
    arquivo,
    `Cadastro_UTs_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.xlsx`
  );

}