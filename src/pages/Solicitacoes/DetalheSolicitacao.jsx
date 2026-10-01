import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../firebase/firebaseConfig";

import {
    buscarSolicitacao,
    darAceiteSolicitacao,
    devolverSolicitacao,
    anexarDocumento,
    atualizarAcompanhamentoCliente,
    concluirAcompanhamentoCliente
} from "../../services/solicitacoesService";

import ResumoSolicitacaoVisualizacao
    from "../../components/resumoSolicitacao/ResumoSolicitacaoVisualizacao";

import "./DetalheSolicitacao.css";


function DetalheSolicitacao() {

    const { id } = useParams();

    const navigate =
        useNavigate();


    /* ============================
       SOLICITAÇÃO
    ============================ */

    const [dados, setDados] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    /* ============================
       USUÁRIO LOGADO
    ============================ */

    const [perfilUsuario, setPerfilUsuario] =
        useState(null);

    const [carregandoPerfil, setCarregandoPerfil] =
        useState(true);


    /* ============================
       CARREGAR USUÁRIO
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setPerfilUsuario(null);

                        setCarregandoPerfil(false);

                        return;

                    }


                    try {

                        const referencia =
                            doc(
                                db,
                                "Usuarios",
                                usuarioFirebase.uid
                            );


                        const documento =
                            await getDoc(
                                referencia
                            );


                        if (
                            documento.exists()
                        ) {

                            const usuario =
                                documento.data();


                            console.log(
                                "Perfil do usuário:",
                                usuario
                            );


                            setPerfilUsuario(
                                usuario
                            );

                        }

                        else {

                            setPerfilUsuario(
                                null
                            );

                        }

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar perfil:",
                            erro
                        );

                        setPerfilUsuario(
                            null
                        );

                    }

                    finally {

                        setCarregandoPerfil(
                            false
                        );

                    }

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /* ============================
       IDENTIFICAR PERFIL
    ============================ */

    const ehUsuarioUT =
        perfilUsuario?.perfil === "UT";


    const ehAdministrador =
        perfilUsuario?.perfil === "ADMIN";


    /* ============================
       CARREGAR SOLICITAÇÃO
    ============================ */

    useEffect(() => {

        carregar();

    }, [id]);


    async function carregar() {

        try {

            setLoading(true);


            const resposta =
                await buscarSolicitacao(id);


            console.log(
                "Solicitação carregada:",
                resposta
            );


            console.log(
                "Cadastro Administrativo:",
                resposta.dadosCadastro
            );


            setDados(
                resposta
            );

        }

        catch (erro) {

            console.error(
                "Erro ao carregar solicitação:",
                erro
            );

        }

        finally {

            setLoading(false);

        }

    }


    /* ============================
       ACEITE
       SOMENTE ADMIN
    ============================ */

    async function darAceite() {

        if (ehUsuarioUT) {

            return;

        }


        try {

            await darAceiteSolicitacao(
                id
            );


            await carregar();


            alert(
                "Solicitação encaminhada para Elaboração do PGR."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            alert(
                "Erro ao atualizar a solicitação."
            );

        }

    }


    /* ============================
       DEVOLVER
       SOMENTE ADMIN
    ============================ */

    async function devolver() {

        if (ehUsuarioUT) {

            return;

        }


        const motivo =
            prompt(
                "Informe o motivo da devolução:"
            );


        if (!motivo) {

            return;

        }


        try {

            await devolverSolicitacao(
                id,
                motivo
            );


            await carregar();


            alert(
                "Solicitação devolvida para correção."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            alert(
                "Erro ao devolver a solicitação."
            );

        }

    }


    /* ============================
       PUBLICAR DOCUMENTO
       SOMENTE ADMIN
    ============================ */

    async function enviarDocumento(
        tipo,
        documento
    ) {

        if (ehUsuarioUT) {

            alert(
                "Usuários de UT não possuem permissão para publicar documentos."
            );

            return;

        }


        try {

            await anexarDocumento(
                id,
                tipo,
                documento
            );


            await carregar();


            alert(
                "Documento publicado com sucesso."
            );

        }

        catch (erro) {

            console.error(
                erro
            );


            alert(
                "Erro ao publicar documento."
            );

        }

    }


    async function salvarAcompanhamentoCliente(
        dadosAcompanhamento
    ) {

        try {

            await atualizarAcompanhamentoCliente(
                id,
                dadosAcompanhamento
            );

            await carregar();

            alert(
                "Acompanhamento do cliente atualizado com sucesso."
            );

        }
        catch (erro) {

            console.error(
                "Erro ao atualizar acompanhamento do cliente:",
                erro
            );

            alert(
                erro?.message ||
                "Erro ao atualizar acompanhamento do cliente."
            );

        }

    }


    async function concluirAcompanhamentoClienteFluxo(
        dadosAcompanhamento
    ) {

        try {

            await concluirAcompanhamentoCliente(
                id,
                dadosAcompanhamento
            );

            await carregar();

            alert(
                "Solicitação concluída com sucesso."
            );

        }
        catch (erro) {

            console.error(
                "Erro ao concluir solicitação:",
                erro
            );

            alert(
                erro?.message ||
                "Erro ao concluir solicitação."
            );

        }

    }


    async function avancarParaCorrecao(motivoInformado) {

        const motivo =
            String(
                motivoInformado ??
                dados?.motivoReprovacaoCliente ??
                ""
            )
                .trim();

        const protocoloOriginal =
            dados?.protocolo || "";

        if (!motivo) {
            alert("É necessário informar o motivo da reprovação antes de avançar para a correção.");
            return;
        }

        const confirmar =
            window.confirm(
                `A solicitação será convertida em uma correção originada pela reprovação do cliente.\n\nSolicitação original: ${protocoloOriginal}\nMotivo: ${motivo}`
            );

        if (!confirmar) {
            return;
        }

        try {

            const dataReprovacao =
                new Date().toISOString().slice(0, 10);

            const dataPostagemCliente =
                dados?.dataPostagemCliente?.toDate
                    ? dados.dataPostagemCliente.toDate().toISOString().slice(0, 10)
                    : dados?.dataPostagemCliente || "";

            const dataRespostaPostagem =
                dados?.dataRespostaPostagem?.toDate
                    ? dados.dataRespostaPostagem.toDate().toISOString()
                    : dados?.dataRespostaPostagem || new Date().toISOString();

            await atualizarAcompanhamentoCliente(
                id,
                {
                    ...dados,
                    clienteExigePostagem:
                        dados?.clienteExigePostagem ?? true,
                    dataRespostaPostagem,
                    dataPostagemCliente,
                    dataAguardandoRetorno: null,
                    statusAprovacaoCliente: "reprovado",
                    dataAprovacaoCliente: null,
                    dataReprovacaoCliente: dataReprovacao,
                    motivoReprovacaoCliente: motivo,
                    status: "Reprovado",
                    concluidaEm: null,
                    protocolo: protocoloOriginal
                }
            );

            navigate(
                `/solicitacoes/nova?origemSolicitacao=${encodeURIComponent(id)}&origemProtocolo=${encodeURIComponent(protocoloOriginal)}&motivoReprovacao=${encodeURIComponent(motivo)}`
            );

        }
        catch (erro) {
            console.error(
                "Erro ao persistir a reprovação antes de abrir a correção:",
                erro
            );

            alert(
                erro?.message ||
                "Não foi possível registrar a reprovação antes de abrir a correção."
            );
        }

    }


    /* ============================
       EDITAR CORREÇÃO
       SOMENTE ADMIN / FLUXO
    ============================ */

    function editarCorrecao() {

        if (
            !ehUsuarioUT &&
            !ehAdministrador
        ) {

            return;

        }


        if (
            dados?.status !==
            "Correção Solicitada"
        ) {

            alert(
                "Esta solicitação não está aguardando correção."
            );

            return;

        }


        navigate(
            `/solicitacoes/${id}/editar`
        );

    }


    /* ============================
       CARREGANDO
    ============================ */

    if (
        loading ||
        carregandoPerfil
    ) {

        return (

            <h2>

                Carregando...

            </h2>

        );

    }


    /* ============================
       SOLICITAÇÃO NÃO ENCONTRADA
    ============================ */

    if (!dados) {

        return (

            <h2>

                Solicitação não encontrada.

            </h2>

        );

    }


    /* ============================
       DADOS DA SOLICITAÇÃO
    ============================ */

    const dadosCadastro =
        dados.dadosCadastro || {};


    const cadastroAdministrativo =

        Object.keys(
            dadosCadastro
        ).length > 0

            ? dadosCadastro

            : null;


    /* ============================
       UT
    ============================ */

    const numeroUT =

        dadosCadastro.numeroUT ||

        dados.ut ||

        dados.numeroUT ||

        "";


    const nomeUT =

        dadosCadastro.nomeUT ||

        dados.nomeUT ||

        "";


    return (

        <div className="detalheSolicitacao">


            {/* ============================
               VOLTAR
            ============================ */}

            <button

                className="btnVoltar"

                onClick={() =>
                    navigate(-1)
                }

            >

                ← Voltar

            </button>


            {/* ============================
               CABEÇALHO
            ============================ */}

            <div className="cabecalhoDetalhe">

                <div className="topoDetalhe">


                    <div>

                        <div className="tituloProtocolo">

                            {dados.protocolo}

                        </div>


                        <div className="nomeUT">

                            {nomeUT || "-"}

                        </div>


                        <div className="tipoSolicitacao">

                            {
                                dados.tipoSolicitacao
                                ||
                                "-"
                            }

                        </div>

                    </div>


                    <div className="statusBadge">

                        {
                            dados.status
                            ||
                            "-"
                        }

                    </div>

                </div>

            </div>


            {/* ============================
               RESUMO
            ============================ */}

            <ResumoSolicitacaoVisualizacao

                utSelecionada={{

                    numeroUT:
                        numeroUT,

                    nomeUT:
                        nomeUT

                }}


                cadastroAdministrativo={
                    cadastroAdministrativo
                }


                dadosCadastroOriginal={
                    dadosCadastro
                }


                dadosCadastro={
                    dadosCadastro
                }


                cadastroAdministrativoPrimeiraSolicitacao={
                    dados.cadastroAdministrativoPrimeiraSolicitacao === true
                }


                cadastroAdministrativoAlteradoNestaSolicitacao={
                    dados.cadastroAdministrativoAlteradoNestaSolicitacao === true
                }


                tipoSolicitacao={
                    dados.tipoSolicitacao
                }


                documentosGerados={

                    dados.dadosSolicitacao
                        ?.documentosGerados

                    ||

                    dados.documentosGerados

                    ||

                    []

                }


                dadosSolicitacao={

                    dados.dadosSolicitacao

                    ||

                    {}

                }


                lancamentoLTCAT={

                    dados.lancamentoLTCAT

                    ||

                    {}

                }


                revisaoAnual={

                    dados.revisaoAnual

                    ||

                    {}

                }


                adequacaoCorrecao={

                    dados.adequacaoCorrecao

                    ||

                    {}

                }


                funcoes={

                    dados.funcoes

                    ||

                    []

                }


                protocolo={
                    dados.protocolo
                }


                statusSolicitacao={
                    dados.status
                }


                motivoDevolucao={
                    dados.motivoDevolucao
                    ||
                    ""
                }


                totalDevolucoes={
                    dados.totalDevolucoes
                }


                etapaWorkflow={

                    dados.etapaWorkflow

                    ||

                    2

                }


                /*
                ====================================
                PERFIL
                ====================================
                */

                perfilUsuario={
                    perfilUsuario?.perfil || ""
                }


                ehUsuarioUT={
                    ehUsuarioUT
                }


                ehAdministrador={
                    ehAdministrador
                }


                /*
                ====================================
                SOMENTE ADMIN PODE EXECUTAR
                ====================================
                */

                onDarAceite={

                    ehAdministrador
                        ? darAceite
                        : null

                }


                onDevolver={

                    ehAdministrador
                        ? devolver
                        : null

                }


                onEnviarDocumento={

                    ehAdministrador
                        ? enviarDocumento
                        : null

                }


                onEditarCorrecao={

                    (
                        ehAdministrador ||
                        ehUsuarioUT
                    ) &&
                    dados?.status ===
                    "Correção Solicitada"
                        ? editarCorrecao
                        : null

                }

                dadosSolicitacaoCompleta={
                    dados
                }

                onSalvarAcompanhamentoCliente={
                    salvarAcompanhamentoCliente
                }

                onConcluirAcompanhamentoCliente={
                    concluirAcompanhamentoClienteFluxo
                }

                onAvancarParaCorrecao={
                    avancarParaCorrecao
                }

                onAbrirRelacionada={
                    (solicitacaoRelacionadaId) =>
                        navigate(`/solicitacoes/${solicitacaoRelacionadaId}`)
                }

            />

        </div>

    );

}


export default DetalheSolicitacao;