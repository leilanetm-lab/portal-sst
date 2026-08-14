import Accordion from "../../../components/Accordion";

import AlteracaoDadosContrato from "../cadastro/AlteracaoDadosContrato";
import AlteracaoInformacoesCliente from "../cadastro/AlteracaoInformacoesCliente";
import AlteracaoInformacoesManserv from "../cadastro/AlteracaoInformacoesManserv";

import {
    salvarCadastro
} from "../../../services/cadastroAdministrativoService";


function AlteracaoCadastro({

    utSelecionada,

    cadastroAdministrativo,

    houveAlteracaoCadastro,

    setHouveAlteracaoCadastro,

    dadosCadastro,

    setDadosCadastro,

    setEtapa

}) {

    /* ============================
       VALIDAR UT
    ============================ */

    if (!utSelecionada && !dadosCadastro?.numeroUT) {

        return (

            <div className="card">

                <div className="mensagem erro">

                    ❌ Não foi possível identificar a Unidade de Trabalho.

                </div>

            </div>

        );

    }


    /* ============================
       POSSUI CADASTRO
    ============================ */

    const possuiCadastro =
        cadastroAdministrativo !== null &&
        cadastroAdministrativo !== undefined;


    /* ============================
       CAMPOS OBRIGATÓRIOS
    ============================ */

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
            "CNAE da Atividade do Cliente",

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


    /* ============================
       VALIDAR CADASTRO
    ============================ */

    function validarCadastro() {

        const campoVazio =
            Object.entries(
                obrigatorios
            ).find(
                ([campo]) => {

                    const valor =
                        dadosCadastro?.[campo];

                    return (

                        valor === undefined ||

                        valor === null ||

                        String(valor).trim() === ""

                    );

                }
            );


        if (campoVazio) {

            alert(
                `O campo "${campoVazio[1]}" é obrigatório.`
            );

            return false;

        }


        return true;

    }


    /* ============================
       IDENTIFICAR NÚMERO DA UT
    ============================ */

    function obterNumeroUT() {

        const numeroUT =

            utSelecionada?.numeroUT ||

            dadosCadastro?.numeroUT ||

            cadastroAdministrativo?.numeroUT ||

            "";


        console.log(
            "Número da UT identificado:",
            numeroUT
        );


        console.log(
            "utSelecionada:",
            utSelecionada
        );


        console.log(
            "dadosCadastro:",
            dadosCadastro
        );


        console.log(
            "cadastroAdministrativo:",
            cadastroAdministrativo
        );


        return numeroUT;

    }


    /* ============================
       SALVAR CADASTRO ADMINISTRATIVO
    ============================ */

    async function salvarCadastroAdministrativo() {

        try {

            /* ============================
               IDENTIFICAR UT
            ============================ */

            const numeroUT =
                obterNumeroUT();


            if (!numeroUT) {

                console.error(
                    "Número da UT não encontrado."
                );


                alert(
                    "❌ Não foi possível identificar a Unidade de Trabalho. Volte e selecione a UT novamente."
                );


                return false;

            }


            /* ============================
               MONTAR DADOS FINAIS
            ============================ */

            const dadosFinais = {

                ...dadosCadastro,


                numeroUT:
                    String(numeroUT),


                nomeUT:

                    dadosCadastro?.nomeUT ||

                    utSelecionada?.nomeUT ||

                    cadastroAdministrativo?.nomeUT ||

                    "",


                cliente:

                    dadosCadastro?.cliente ||

                    utSelecionada?.cliente ||

                    cadastroAdministrativo?.cliente ||

                    "",


                cidade:

                    dadosCadastro?.cidade ||

                    utSelecionada?.cidade ||

                    cadastroAdministrativo?.cidade ||

                    "",


                estado:

                    dadosCadastro?.estado ||

                    utSelecionada?.estado ||

                    cadastroAdministrativo?.estado ||

                    ""

            };


            console.log(
                "Dados finais para salvar:",
                dadosFinais
            );


            /* ============================
               SALVAR FIREBASE
            ============================ */

            await salvarCadastro(

                String(numeroUT),

                dadosFinais

            );


            console.log(
                "Cadastro Administrativo salvo com sucesso:",
                numeroUT
            );


            return true;

        }

        catch (erro) {

            console.error(
                "Erro ao salvar Cadastro Administrativo:",
                erro
            );


            alert(
                "❌ Não foi possível salvar o Cadastro Administrativo. Tente novamente."
            );


            return false;

        }

    }


    /* ============================
       CONTINUAR
    ============================ */

    async function continuar() {

        /* ============================
           UT POSSUI CADASTRO
        ============================ */

        if (possuiCadastro) {


            /* ============================
               PERGUNTA OBRIGATÓRIA
            ============================ */

            if (!houveAlteracaoCadastro) {

                alert(
                    "⚠️ Informe se houve alteração no Cadastro Administrativo."
                );

                return;

            }


            /* ============================
               NÃO HOUVE ALTERAÇÃO
            ============================ */

            if (
                houveAlteracaoCadastro === "nao"
            ) {

                setEtapa(2);

                return;

            }


            /* ============================
               HOUVE ALTERAÇÃO
            ============================ */

            if (
                houveAlteracaoCadastro === "sim"
            ) {


                /* ============================
                   DESCRIÇÃO OBRIGATÓRIA
                ============================ */

                const descricao =

                    dadosCadastro
                        ?.descricaoAlteracao
                        ?.trim();


                if (!descricao) {

                    alert(
                        "⚠️ Descreva resumidamente quais alterações ocorreram."
                    );

                    return;

                }


                /* ============================
                   VALIDAR CAMPOS
                ============================ */

                if (!validarCadastro()) {

                    return;

                }


                /* ============================
                   SALVAR ALTERAÇÃO
                ============================ */

                const salvo =
                    await salvarCadastroAdministrativo();


                if (!salvo) {

                    return;

                }


                alert(
                    "✅ Cadastro Administrativo atualizado com sucesso."
                );


                setEtapa(2);

                return;

            }


            return;

        }


        /* ============================
           UT NÃO POSSUI CADASTRO
        ============================ */

        if (!possuiCadastro) {


            /* ============================
               VALIDAR CAMPOS
            ============================ */

            if (!validarCadastro()) {

                return;

            }


            /* ============================
               SALVAR NOVO CADASTRO
            ============================ */

            const salvo =
                await salvarCadastroAdministrativo();


            if (!salvo) {

                return;

            }


            alert(
                "✅ Cadastro Administrativo salvo com sucesso."
            );


            setEtapa(2);

            return;

        }

    }


    return (

        <div className="card">


            {/* ============================
                TÍTULO
            ============================ */}

            <h2>

                {

                    possuiCadastro

                        ?

                        "📄 Alteração do Cadastro Administrativo"

                        :

                        "📄 Cadastro Administrativo"

                }

            </h2>


            {/* ============================
                CADASTRO EXISTENTE
            ============================ */}

            {possuiCadastro ? (

                <>


                    <p className="descricao">

                        O Cadastro Administrativo desta UT já existe.

                        Informe se houve alguma alteração.

                    </p>


                    {/* ============================
                        PERGUNTA
                    ============================ */}

                    <div className="campo">

                        <label>

                            Houve alteração no Cadastro Administrativo?

                            <span
                                style={{
                                    color: "#d32f2f",
                                    marginLeft: "4px"
                                }}
                            >

                                *

                            </span>

                        </label>


                        <select

                            value={
                                houveAlteracaoCadastro
                            }

                            onChange={(e) =>
                                setHouveAlteracaoCadastro(
                                    e.target.value
                                )
                            }

                        >

                            <option value="">

                                Selecione...

                            </option>


                            <option value="nao">

                                Não

                            </option>


                            <option value="sim">

                                Sim

                            </option>

                        </select>

                    </div>


                    {/* ============================
                        HOUVE ALTERAÇÃO
                    ============================ */}

                    {
                        houveAlteracaoCadastro === "sim" && (

                            <>


                                <div className="campo">

                                    <label>

                                        Descreva resumidamente quais alterações ocorreram

                                        <span
                                            style={{
                                                color: "#d32f2f",
                                                marginLeft: "4px"
                                            }}
                                        >

                                            *

                                        </span>

                                    </label>


                                    <textarea

                                        rows="5"

                                        value={

                                            dadosCadastro
                                                ?.descricaoAlteracao
                                            ||

                                            ""

                                        }

                                        onChange={(e) =>
                                            setDadosCadastro({

                                                ...dadosCadastro,

                                                descricaoAlteracao:
                                                    e.target.value

                                            })
                                        }

                                        placeholder="Ex.: Alteração do gestor do contrato, atualização da vigência contratual, alteração do endereço da unidade..."

                                    />

                                </div>


                                {/* ============================
                                    DADOS CONTRATO
                                ============================ */}

                                <Accordion

                                    titulo="📄 Dados do Contrato"

                                    abertoInicial={true}

                                >

                                    <AlteracaoDadosContrato

                                        dados={
                                            dadosCadastro
                                        }

                                        setDados={
                                            setDadosCadastro
                                        }

                                    />

                                </Accordion>


                                {/* ============================
                                    CLIENTE
                                ============================ */}

                                <Accordion

                                    titulo="🏢 Informações do Cliente"

                                >

                                    <AlteracaoInformacoesCliente

                                        dados={
                                            dadosCadastro
                                        }

                                        setDados={
                                            setDadosCadastro
                                        }

                                    />

                                </Accordion>


                                {/* ============================
                                    MANSERV
                                ============================ */}

                                <Accordion

                                    titulo="👷 Informações da Manserv"

                                >

                                    <AlteracaoInformacoesManserv

                                        dados={
                                            dadosCadastro
                                        }

                                        setDados={
                                            setDadosCadastro
                                        }

                                    />

                                </Accordion>


                            </>

                        )
                    }


                </>

            ) : (

                /* ============================
                   SEM CADASTRO
                ============================ */

                <>


                    <div className="mensagem erro">

                        ⚠ Esta Unidade ainda não possui Cadastro Administrativo.

                    </div>


                    <p className="descricao">

                        Para prosseguir com a solicitação,
                        preencha o Cadastro Administrativo abaixo.

                    </p>


                    <Accordion

                        titulo="📄 Dados do Contrato"

                        abertoInicial={true}

                    >

                        <AlteracaoDadosContrato

                            dados={
                                dadosCadastro
                            }

                            setDados={
                                setDadosCadastro
                            }

                        />

                    </Accordion>


                    <Accordion

                        titulo="🏢 Informações do Cliente"

                    >

                        <AlteracaoInformacoesCliente

                            dados={
                                dadosCadastro
                            }

                            setDados={
                                setDadosCadastro
                            }

                        />

                    </Accordion>


                    <Accordion

                        titulo="👷 Informações da Manserv"

                    >

                        <AlteracaoInformacoesManserv

                            dados={
                                dadosCadastro
                            }

                            setDados={
                                setDadosCadastro
                            }

                        />

                    </Accordion>


                </>

            )}


            {/* ============================
                BOTÃO CONTINUAR
            ============================ */}

            <div

                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 30
                }}

            >

                <button

                    type="button"

                    onClick={
                        continuar
                    }

                >

                    Continuar →

                </button>

            </div>


        </div>

    );

}


export default AlteracaoCadastro;