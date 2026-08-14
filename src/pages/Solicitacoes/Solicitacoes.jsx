import { useState } from "react";

import "./Solicitacoes.css";

import SelecaoUT from "./sections/SelecaoUT";
import AlteracaoCadastro from "./sections/AlteracaoCadastro";
import TipoSolicitacao from "./sections/TipoSolicitacao";
import DadosSolicitacao from "./sections/DadosSolicitacao";
import DadosFuncao from "./sections/DadosFuncao";
import CadastroRiscos from "./sections/CadastroRiscos";
import LancamentoLTCAT from "./sections/LancamentoLTCAT";
import RevisaoAnual from "./sections/RevisaoAnual";
import AdequacaoCorrecao from "./sections/AdequacaoCorrecao";
import DadosGerais from "./sections/DadosGerais";
import ResumoSolicitacao from "../../components/resumoSolicitacao/ResumoSolicitacao";
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    runTransaction
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function Solicitacoes() {

    // =====================================
    // CONTROLE DAS ETAPAS
    // =====================================

    const [etapa, setEtapa] = useState(1);

    // =====================================
    // UNIDADE
    // =====================================

    const [utSelecionada, setUtSelecionada] = useState(null);

    const [cadastroAdministrativo, setCadastroAdministrativo] = useState(null);

    const [houveAlteracaoCadastro, setHouveAlteracaoCadastro] = useState("");

    const [dadosCadastroOriginal, setDadosCadastroOriginal] = useState({});
    
    const [dadosCadastro, setDadosCadastro] = useState({});

    // =====================================
    // TIPO DA SOLICITAÇÃO
    // =====================================

    const [tipoSolicitacao, setTipoSolicitacao] = useState("");

    const [documentosGerados, setDocumentosGerados] = useState([]);

    // =====================================
    // DADOS DA SOLICITAÇÃO
    // =====================================

    const [dadosSolicitacao, setDadosSolicitacao] = useState({});

    // =====================================
    // DADOS DA FUNÇÃO
    // =====================================

    const [dadosFuncao, setDadosFuncao] = useState({
    
        colaborador: "",

        emContratacao: false,

        funcao: "",

        setor: "",

        tipoGHE: "",

        identificacaoGHE: "",

        descricaoAtividade: "",

        descricaoLocal: "",

        riscos: []

    });

const [funcoes, setFuncoes] = useState([]);
const [protocolo, setProtocolo] = useState("");
const [statusSolicitacao, setStatusSolicitacao] = useState("Em preenchimento");
const [aceite, setAceite] = useState(false);
const [revisaoAnual, setRevisaoAnual] = useState({

    possuiAlteracao: ""

});
const [lancamentoLTCAT, setLancamentoLTCAT] = useState({
    tipoLancamento: "",
    gheAtual: "",
    ghes: []
});
const [adequacaoCorrecao, setAdequacaoCorrecao] = useState({

    tipoAlteracao: "",

    descricao: ""

});

// =====================================
// ENVIO DA SOLICITAÇÃO
// =====================================

const onEnviar = async () => {

    try {

        const contadorRef = doc(db, "Contadores", "protocolos");

const protocolo = await runTransaction(db, async (transaction) => {

    const contadorDoc = await transaction.get(contadorRef);

    const ultimoNumero = contadorDoc.data().ultimoNumero || 0;

    const proximoNumero = ultimoNumero + 1;

    transaction.update(contadorRef, {

        ultimoNumero: proximoNumero

    });

    return `OS-${new Date().getFullYear()}-${String(proximoNumero).padStart(6, "0")}`;

});

await addDoc(collection(db, "Solicitacoes"), {

    protocolo,

    // Controle
    status: "Em Análise Técnica",
    criadoEm: serverTimestamp(),
    aceite,
    aceiteEm: serverTimestamp(),

    // Unidade
    ut: dadosCadastro.numeroUT || "",
    cliente: dadosCadastro.cliente || "",
    cidade: dadosCadastro.cidade || "",
    gerenteContrato: dadosCadastro.gerenteContrato || "",
    emailGerente: dadosCadastro.emailGerente || "",

    // Solicitação
    tipoSolicitacao,
    documentosGerados,

    // Dados da Solicitação
dadosSolicitacao,

// Lançamento de LTCAT
lancamentoLTCAT,
tipoLancamentoLTCAT:

    lancamentoLTCAT.tipoLancamento === "todos"

        ? "Todos os GHEs"

        : "GHEs específicos",

// Revisão Anual
revisaoAnual,

tipoRevisao:

    revisaoAnual.possuiAlteracao === "nao"

        ? "Apenas atualização da vigência"

        : revisaoAnual.possuiAlteracao === "sim"

            ? "Alteração técnica"

            : "",

// Adequação / Correção
adequacaoCorrecao,
tipoAlteracao:

    adequacaoCorrecao.tipoAlteracao === "administrativo"

        ? "Dados Administrativos"

        : adequacaoCorrecao.tipoAlteracao === "tecnica"

            ? "Alteração Técnica"

            : adequacaoCorrecao.tipoAlteracao === "geral"

                ? "Dados Gerais"

                : "",

// Funções
funcoes,

    // Cadastro Administrativo
    dadosCadastro

});

setProtocolo(protocolo);

setStatusSolicitacao("Em Análise Técnica");

    alert("Solicitação enviada com sucesso!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao enviar a solicitação.");

    }

};
        return(

        <div className="solicitacoes">

            <div className="cabecalho">

                <h1>

                    Nova Solicitação

                </h1>

                <p>

                    Preencha as informações abaixo para solicitar atualização dos documentos legais da unidade.

                </p>

            </div>

            {/* ==========================
                ETAPA 1
            ========================== */}

            {

                etapa===1 && (

                    <>

                        <SelecaoUT

    utSelecionada={utSelecionada}

    setUtSelecionada={setUtSelecionada}

    cadastroAdministrativo={cadastroAdministrativo}

    setCadastroAdministrativo={setCadastroAdministrativo}

    dadosCadastro={dadosCadastro}

    setDadosCadastro={setDadosCadastro}

    setDadosCadastroOriginal={setDadosCadastroOriginal}

 />

                        <AlteracaoCadastro

                            utSelecionada={utSelecionada}

                            cadastroAdministrativo={cadastroAdministrativo}

                            houveAlteracaoCadastro={houveAlteracaoCadastro}

                            setHouveAlteracaoCadastro={setHouveAlteracaoCadastro}

                            dadosCadastro={dadosCadastro}

                            setDadosCadastro={setDadosCadastro}

                            setEtapa={setEtapa}

                        />

                    </>

                )

            }

            {/* ==========================
                ETAPA 2
            ========================== */}

            {

                etapa===2 && (

                    <TipoSolicitacao

                        tipoSolicitacao={tipoSolicitacao}

                        setTipoSolicitacao={setTipoSolicitacao}

                        documentosGerados={documentosGerados}

                        setDocumentosGerados={setDocumentosGerados}

                        setEtapa={setEtapa}

                    />

                )

            }

            {/* ==========================
                ETAPA 3
            ========================== */}

            {

                etapa===3 && (

                    <DadosSolicitacao

                        tipoSolicitacao={tipoSolicitacao}

                        dadosSolicitacao={dadosSolicitacao}

                        setDadosSolicitacao={setDadosSolicitacao}

                        setEtapa={setEtapa}

                    />

                )

            }
                        {/* ==========================
                ETAPA 4
            ========================== */}

            {

                etapa===4 && (

                    <DadosFuncao
    dadosFuncao={dadosFuncao}
    setDadosFuncao={setDadosFuncao}
    setEtapa={setEtapa}
    permitirNovoGHE={
        !(
            (tipoSolicitacao === "Adequação" ||
             tipoSolicitacao === "Correção") &&
            adequacaoCorrecao?.tipoAlteracao === "tecnica"
        )
    }
/>

                )

            }

            {/* ==========================
                ETAPA 5
            ========================== */}

            {

                etapa===5 && (

                    <CadastroRiscos

    dadosFuncao={dadosFuncao}

    setDadosFuncao={setDadosFuncao}

    funcoes={funcoes}

    setFuncoes={setFuncoes}

    setEtapa={setEtapa}

/>

                )

            }
{/* ==========================
    ETAPA LTCAT
========================== */}

{
    etapa === 5.5 && (

        <LancamentoLTCAT

            lancamentoLTCAT={lancamentoLTCAT}

            setLancamentoLTCAT={setLancamentoLTCAT}

            setEtapa={setEtapa}

        />

    )

}
{
    etapa === 5.6 && (

        <RevisaoAnual

            revisaoAnual={revisaoAnual}

            setRevisaoAnual={setRevisaoAnual}

            setEtapa={setEtapa}

        />

    )
}

{
    etapa === 5.7 && (

        <AdequacaoCorrecao

            adequacaoCorrecao={adequacaoCorrecao}

            setAdequacaoCorrecao={setAdequacaoCorrecao}

            setEtapa={setEtapa}

        />

    )

}

{
    etapa === 5.8 && (

        <DadosGerais

            adequacaoCorrecao={adequacaoCorrecao}

            setAdequacaoCorrecao={setAdequacaoCorrecao}

            setEtapa={setEtapa}

        />

    )

}
            {/* ==========================
                ETAPA 6
            ========================== */}

            {

                etapa===6 && (

                    <ResumoSolicitacao

    utSelecionada={utSelecionada}

    cadastroAdministrativo={cadastroAdministrativo}

    dadosCadastroOriginal={dadosCadastroOriginal}

    dadosCadastro={dadosCadastro}

    tipoSolicitacao={tipoSolicitacao}

    documentosGerados={documentosGerados}

    dadosSolicitacao={dadosSolicitacao}
    
    lancamentoLTCAT={lancamentoLTCAT}

    revisaoAnual={revisaoAnual}

    adequacaoCorrecao={adequacaoCorrecao}
    
    funcoes={funcoes}

    protocolo={protocolo}

    statusSolicitacao={statusSolicitacao}

    aceite={aceite}

    setAceite={setAceite}

    setEtapa={setEtapa}

    onEnviar={onEnviar}

/>
                )

            }

        </div>

    );

}

export default Solicitacoes;