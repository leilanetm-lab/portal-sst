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

import {
    notificarAdministradores
} from "../../services/notificacoesService";


function CadastroAdministrativo() {


    // =====================================================
    // UT SELECIONADA
    // =====================================================

    const [
        utSelecionada,
        setUtSelecionada
    ] = useState(null);


    // =====================================================
    // DADOS DO CADASTRO
    // =====================================================

    const [
        dadosCadastro,
        setDadosCadastro
    ] = useState({

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

        emailCoordenador: ""

    });


    // =====================================================
    // CARREGAR CADASTRO DA UT
    // =====================================================

    async function carregarCadastro(
        ut
    ) {

        setUtSelecionada(
            ut
        );


        const cadastro =
            await buscarCadastro(
                ut.numeroUT
            );


        if (cadastro) {

            setDadosCadastro(
                (anterior) => ({

                    ...anterior,

                    ...cadastro

                })
            );


        }

        else {

            setDadosCadastro({

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

                emailCoordenador: ""

            });

        }

    }


    // =====================================================
    // SALVAR CADASTRO
    // =====================================================

    async function salvar() {


        // =================================================
        // VALIDAR UT
        // =================================================

        if (!utSelecionada) {

            alert(
                "Selecione uma UT."
            );

            return;

        }


        // =================================================
        // CAMPOS OBRIGATÓRIOS
        // =================================================

        const obrigatorios = {

            diretoria:
                "Diretoria",

            locaisAtuacao:
                "Locais de atuação do contrato",

            enderecoExecucao:
                "Endereços dos locais de execução",

            numeroContrato:
                "Número do Contrato",

            vigenciaContrato:
                "Vigência do Contrato",

            segmento:
                "Segmento",

            cnpjAtualizado:
                "CNPJ Atualizado",

            turnoTrabalho:
                "Turno de Trabalho",

            cnae:
                "CNAE da Atividade",


            ramoContratante:
                "Ramo da Atividade da Contratante",

            ramoUT:
                "Ramo da Atividade da UT",

            enderecoLocalidade:
                "Endereço da Localidade",

            nomeContratante:
                "Nome da Contratante",

            cnpjCliente:
                "CNPJ do Cliente",

            cnaeCliente:
                "CNAE da Atividade",

            grauRiscoContratante:
                "Grau de Risco da Contratante",


            grauRiscoContratada:
                "Grau de Risco da Contratada",

            objetoContrato:
                "Objeto do Contrato",

            abrangenciaContrato:
                "Abrangência do Contrato",


            gestorContrato:
                "Gestor do Contrato",

            emailGestor:
                "E-mail do Gestor",


            fiscalContrato:
                "Fiscal do Contrato",

            emailFiscal:
                "E-mail do Fiscal",


            gerenteContrato:
                "Gerente do Contrato",

            emailGerente:
                "E-mail do Gerente",


            coordenadorContrato:
                "Coordenador do Contrato",

            emailCoordenador:
                "E-mail do Coordenador"

        };


        // =================================================
        // VERIFICAR CAMPOS VAZIOS
        // =================================================

        const campoVazio =

            Object.entries(
                obrigatorios
            ).find(

                ([campo]) =>

                    !dadosCadastro[
                        campo
                    ]?.trim()

            );


        if (campoVazio) {

            alert(
                `O campo "${campoVazio[1]}" é obrigatório.`
            );

            return;

        }


        // =================================================
        // SALVAR
        // =================================================

        try {


            const resultado =

                await salvarCadastro(

                    utSelecionada.numeroUT,

                    {

                        ...dadosCadastro,

                        numeroUT:
                            utSelecionada.numeroUT,

                        nomeUT:
                            utSelecionada.nomeUT,

                        cliente:
                            utSelecionada.cliente,

                        cidade:
                            utSelecionada.cidade,

                        estado:
                            utSelecionada.estado

                    }

                );


            console.log(
                "Resultado do cadastro:",
                resultado
            );


            // =================================================
            // PRIMEIRO CADASTRO
            // =================================================

            if (
                resultado.primeiroCadastro
            ) {


                await notificarAdministradores({

                    solicitacaoId:
                        `CADASTRO-${utSelecionada.numeroUT}`,

                    protocolo:
                        "",

                    titulo:
                        "Novo Cadastro Administrativo",

                    mensagem:

                        `A UT ${utSelecionada.numeroUT} - ${utSelecionada.nomeUT} realizou o primeiro cadastro administrativo. O cadastro está disponível para consulta no Portal SST.`,

                    tipo:
                        "cadastro_administrativo"

                });

            }


            // =================================================
            // ALTERAÇÃO DO CADASTRO
            // =================================================

            else if (
                resultado.houveAlteracao
            ) {


                // =================================================
                // NOMES DOS CAMPOS
                // =================================================

                const nomesCampos = {

                    diretoria:
                        "Diretoria",

                    locaisAtuacao:
                        "Locais de atuação do contrato",

                    enderecoExecucao:
                        "Endereços dos locais de execução",

                    numeroContrato:
                        "Número do Contrato",

                    vigenciaContrato:
                        "Vigência do contrato",

                    segmento:
                        "Segmento",

                    cnpjAtualizado:
                        "CNPJ atualizado",

                    turnoTrabalho:
                        "Turno de trabalho",

                    cnae:
                        "CNAE",

                    ramoContratante:
                        "Ramo da atividade da contratante",

                    ramoUT:
                        "Ramo da atividade da UT",

                    enderecoLocalidade:
                        "Endereço da localidade",

                    nomeContratante:
                        "Nome da contratante",

                    cnpjCliente:
                        "CNPJ do cliente",

                    cnaeCliente:
                        "CNAE do cliente",

                    grauRiscoContratante:
                        "Grau de risco da contratante",

                    grauRiscoContratada:
                        "Grau de risco da contratada",

                    objetoContrato:
                        "Objeto do contrato",

                    abrangenciaContrato:
                        "Abrangência do contrato",

                    gestorContrato:
                        "Gestor do contrato",

                    emailGestor:
                        "E-mail do gestor",

                    fiscalContrato:
                        "Fiscal do contrato",

                    emailFiscal:
                        "E-mail do fiscal",

                    gerenteContrato:
                        "Gerente do contrato",

                    emailGerente:
                        "E-mail do gerente",

                    coordenadorContrato:
                        "Coordenador do contrato",

                    emailCoordenador:
                        "E-mail do coordenador"

                };


                // =================================================
                // MONTAR TEXTO DAS ALTERAÇÕES
                // =================================================

                const textoAlteracoes =

                    resultado.alteracoes

                        .map(
                            (
                                alteracao
                            ) => {

                                const nomeCampo =

                                    nomesCampos[
                                        alteracao.campo
                                    ]

                                    ||

                                    alteracao.campo;


                                const anterior =

                                    alteracao.anterior ===
                                    ""

                                        ?

                                        "Não informado"

                                        :

                                        String(
                                            alteracao.anterior
                                        );


                                const atual =

                                    alteracao.atual ===
                                    ""

                                        ?

                                        "Não informado"

                                        :

                                        String(
                                            alteracao.atual
                                        );


                                return (

                                    `• ${nomeCampo}: ${anterior} → ${atual}`

                                );

                            }

                        )

                        .join(
                            "\n"
                        );


                // =================================================
                // NOTIFICAR ADMINISTRADORES
                // =================================================

                await notificarAdministradores({

                    solicitacaoId:
                        `CADASTRO-${utSelecionada.numeroUT}`,

                    protocolo:
                        "",

                    titulo:
                        "Cadastro Administrativo Alterado",

                    mensagem:

                        `A UT ${utSelecionada.numeroUT} - ${utSelecionada.nomeUT} teve alterações no Cadastro Administrativo.\n\n${textoAlteracoes}`,

                    tipo:
                        "cadastro_administrativo"

                });

            }


            // =================================================
            // SUCESSO
            // =================================================

            alert(
                "Cadastro salvo com sucesso!"
            );


        }

        catch (erro) {


            console.error(
                "Erro ao salvar cadastro:",
                erro
            );


            alert(
                "Erro ao salvar."
            );

        }

    }


    // =====================================================
    // TELA
    // =====================================================

    return (

        <div className="cadastro-administrativo">


            {/* ================================================
                CABEÇALHO
            ================================================= */}

            <div className="cabecalho">

                <h1>

                    Cadastro Administrativo da Unidade

                </h1>


                <p>

                    Complete todas as informações abaixo.

                    Caso algum campo não se aplique,

                    informe{" "}

                    <strong>
                        Não aplicável
                    </strong>.

                </p>

            </div>


            {/* ================================================
                DADOS DA UT
            ================================================= */}

            <DadosUT

                ut={
                    utSelecionada
                }

                setUt={
                    carregarCadastro
                }

            />


            {/* ================================================
                DADOS DO CONTRATO
            ================================================= */}

            <DadosContrato

                dados={
                    dadosCadastro
                }

                setDados={
                    setDadosCadastro
                }

            />


            {/* ================================================
                INFORMAÇÕES DO CLIENTE
            ================================================= */}

            <InformacoesCliente

                dados={
                    dadosCadastro
                }

                setDados={
                    setDadosCadastro
                }

            />


            {/* ================================================
                INFORMAÇÕES MANSERV
            ================================================= */}

            <InformacoesManserv

                dados={
                    dadosCadastro
                }

                setDados={
                    setDadosCadastro
                }

            />


            {/* ================================================
                RODAPÉ
            ================================================= */}

            <div className="rodape">


                <button

                    className="cancelar"

                    type="button"

                >

                    Cancelar

                </button>


                <button

                    className="salvar"

                    type="button"

                    onClick={
                        salvar
                    }

                >

                    Salvar Cadastro

                </button>


            </div>


        </div>

    );

}


export default CadastroAdministrativo;