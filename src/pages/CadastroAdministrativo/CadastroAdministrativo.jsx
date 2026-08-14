import { useState } from "react";
import "./CadastroAdministrativo.css";

import DadosUT from "./sections/DadosUT";
import DadosContrato from "./sections/DadosContrato";
import InformacoesCliente from "./sections/InformacoesCliente";
import InformacoesManserv from "./sections/InformacoesManserv";
import {
    salvarCadastro,
    buscarCadastro,
} from "../../services/cadastroAdministrativoService";

function CadastroAdministrativo() {

  const [utSelecionada, setUtSelecionada] = useState(null);

  const [dadosCadastro, setDadosCadastro] = useState({

    // CONTRATO
    diretoria: "",
    locaisAtuacao: "",
    enderecoExecucao: "",
    numeroContrato: "",
    vigenciaContrato: "",
    segmento: "",
    cnpjAtualizado: "",
    turnoTrabalho: "",
    cnae: "",

    // CLIENTE
    ramoContratante: "",
    ramoUT: "",
    enderecoLocalidade: "",
    nomeContratante: "",
    cnpjCliente: "",
    cnaeCliente: "",
    grauRiscoContratante: "",

    // MANSERV
    grauRiscoContratada: "",
    objetoContrato: "",
    abrangenciaContrato: "",

    gestorContrato: "",
    emailGestor: "",

    fiscalContrato: "",
    emailFiscal: "",

    gerenteContrato: "",
    emailGerente: "",

    coordenadorContrato: "",
    emailCoordenador: "",

  });
  async function carregarCadastro(ut){

    setUtSelecionada(ut);

    const cadastro = await buscarCadastro(
        ut.numeroUT
    );

    if (cadastro) {

    setDadosCadastro((anterior) => ({

        ...anterior,

        ...cadastro,

    }));

} else {

        setDadosCadastro({

            // CONTRATO

            diretoria:"",

            locaisAtuacao:"",

            enderecoExecucao:"",

            numeroContrato:"",

            vigenciaContrato:"",

            segmento:"",

            cnpjAtualizado:"",

            turnoTrabalho:"",

            cnae:"",

            // CLIENTE

            ramoContratante:"",

            ramoUT:"",

            enderecoLocalidade:"",

            nomeContratante:"",

            cnpjCliente:"",

            cnaeCliente:"",

            grauRiscoContratante:"",

            // MANSERV

            grauRiscoContratada:"",

            objetoContrato:"",

            abrangenciaContrato:"",

            gestorContrato:"",

            emailGestor:"",

            fiscalContrato:"",

            emailFiscal:"",

            gerenteContrato:"",

            emailGerente:"",

            coordenadorContrato:"",

            emailCoordenador:"",

        });

    }

}
async function salvar() {

    if (!utSelecionada) {

        alert("Selecione uma UT.");

        return;

    }

    const obrigatorios = {
    diretoria: "Diretoria",
    locaisAtuacao: "Locais de atuação do contrato",
    enderecoExecucao: "Endereços dos locais de execução",
    numeroContrato: "Número do Contrato",
    vigenciaContrato: "Vigência do Contrato",
    segmento: "Segmento",
    cnpjAtualizado: "CNPJ Atualizado",
    turnoTrabalho: "Turno de Trabalho",
    cnae: "CNAE da Atividade",

    ramoContratante: "Ramo da Atividade da Contratante",
    ramoUT: "Ramo da Atividade da UT",
    enderecoLocalidade: "Endereço da Localidade",
    nomeContratante: "Nome da Contratante",
    cnpjCliente: "CNPJ do Cliente",
    cnaeCliente: "CNAE da Atividade",
    grauRiscoContratante: "Grau de Risco da Contratante",

    grauRiscoContratada: "Grau de Risco da Contratada",
    objetoContrato: "Objeto do Contrato",
    abrangenciaContrato: "Abrangência do Contrato",
    gestorContrato: "Gestor do Contrato",
    emailGestor: "E-mail do Gestor",
    fiscalContrato: "Fiscal do Contrato",
    emailFiscal: "E-mail do Fiscal",
    gerenteContrato: "Gerente do Contrato",
    emailGerente: "E-mail do Gerente",
    coordenadorContrato: "Coordenador do Contrato",
    emailCoordenador: "E-mail do Coordenador"
};

const campoVazio = Object.entries(obrigatorios).find(
    ([campo]) => !dadosCadastro[campo]?.trim()
);

if (campoVazio) {

    alert(`O campo "${campoVazio[1]}" é obrigatório.`);

    return;

}

    try {

        await salvarCadastro(

    utSelecionada.numeroUT,

    {

        ...dadosCadastro,

        numeroUT: utSelecionada.numeroUT,

        nomeUT: utSelecionada.nomeUT,

        cliente: utSelecionada.cliente,

        cidade: utSelecionada.cidade,

        estado: utSelecionada.estado,

    }

);

        alert("Cadastro salvo com sucesso!");

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao salvar.");

    }

}
  return (

    <div className="cadastro-administrativo">

      <div className="cabecalho">

        <h1>Cadastro Administrativo da Unidade</h1>

        <p>
          Complete todas as informações abaixo.
          Caso algum campo não se aplique,
          informe <strong>Não aplicável</strong>.
        </p>

      </div>

      <DadosUT
    ut={utSelecionada}
    setUt={carregarCadastro}
/>

      <DadosContrato
        dados={dadosCadastro}
        setDados={setDadosCadastro}
      />

      <InformacoesCliente
        dados={dadosCadastro}
        setDados={setDadosCadastro}
      />

      <InformacoesManserv
        dados={dadosCadastro}
        setDados={setDadosCadastro}
      />

      <div className="rodape">

        <button className="cancelar">

          Cancelar

        </button>

        <button
  className="salvar" onClick={salvar}>
  Salvar Cadastro
</button>

      </div>

    </div>

  );

}

export default CadastroAdministrativo;