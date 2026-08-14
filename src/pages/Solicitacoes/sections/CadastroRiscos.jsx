import { useState } from "react";

import AutocompleteRisco from "./cadastroRiscos/AutocompleteRisco";
import PainelResumoRiscos from "./cadastroRiscos/PainelResumoRiscos";
import ListaRiscos from "./cadastroRiscos/ListaRiscos";
import FuncoesCadastradas from "./cadastroRiscos/FuncoesCadastradas";


function CadastroRiscos({

    dadosFuncao,

    setDadosFuncao,

    funcoes,

    setFuncoes,

    setEtapa

}) {


    const [categoria, setCategoria] = useState("");

    const [risco, setRisco] = useState("");


    /* ============================
       VALIDAR RISCO
    ============================ */

    function riscoValido(item) {

        return (

            item.atividade?.trim() &&

            item.contato?.trim() &&

            item.epi?.trim() &&

            item.ca?.trim() &&

            item.epc?.trim() &&

            item.medidas?.trim()

        );

    }


    /* ============================
       ADICIONAR RISCO
    ============================ */

    function adicionarRisco() {

        if (!categoria) {

            alert(
                "Selecione uma categoria."
            );

            return;

        }


        if (!risco.trim()) {

            alert(
                "Selecione um risco."
            );

            return;

        }


        const existe =
            (dadosFuncao.riscos || []).some(

                item =>

                    item.risco === risco &&

                    item.categoria === categoria

            );


        if (existe) {

            alert(
                "Este risco já foi adicionado."
            );

            return;

        }


        const novo = {

            categoria,

            risco,

            atividade: "",

            contato: "",

            epi: "",

            ca: "",

            epc: "",

            medidas: "",

            valido: false

        };


        setDadosFuncao({

            ...dadosFuncao,

            riscos: [

                ...(dadosFuncao.riscos || []),

                novo

            ]

        });


        setCategoria("");

        setRisco("");

    }


    /* ============================
       ATUALIZAR RISCO
    ============================ */

    function atualizarRisco(
        index,
        dados
    ) {

        const lista = [
            ...(dadosFuncao.riscos || [])
        ];


        lista[index] = {

            ...dados,

            valido:
                !!riscoValido(dados)

        };


        setDadosFuncao({

            ...dadosFuncao,

            riscos: lista

        });

    }


    /* ============================
       EXCLUIR RISCO
    ============================ */

    function excluirRisco(index) {

        const nome =
            dadosFuncao.riscos[index].risco;


        const confirmar =
            window.confirm(

                `Deseja realmente excluir o risco?\n\n${nome}\n\nEsta ação não poderá ser desfeita.`

            );


        if (!confirmar) {

            return;

        }


        const lista = [
            ...(dadosFuncao.riscos || [])
        ];


        lista.splice(index, 1);


        setDadosFuncao({

            ...dadosFuncao,

            riscos: lista

        });

    }


    /* ============================
       SALVAR / ATUALIZAR FUNÇÃO
    ============================ */

    function salvarFuncao() {

        const funcaoFinalizada = {

            ...dadosFuncao,

            finalizada: true

        };


        setFuncoes((listaAtual) => {


            /*
             * Procura se esta função
             * já existe na lista.
             *
             * Usamos função + setor como
             * identificação, mantendo a
             * lógica que já existia.
             */

            const indiceExistente =
                listaAtual.findIndex(

                    item =>

                        item.funcao ===
                            funcaoFinalizada.funcao &&

                        item.setor ===
                            funcaoFinalizada.setor

                );


            /*
             * SE JÁ EXISTE:
             *
             * Substitui a versão antiga
             * pela versão atualizada.
             *
             * Isso é o que permite que
             * novos riscos e alterações
             * apareçam no resumo.
             */

            if (
                indiceExistente !== -1
            ) {

                const novaLista = [
                    ...listaAtual
                ];


                novaLista[
                    indiceExistente
                ] = funcaoFinalizada;


                return novaLista;

            }


            /*
             * SE NÃO EXISTE:
             *
             * Adiciona normalmente.
             *
             * Isso mantém o funcionamento
             * da Nova Solicitação.
             */

            return [

                ...listaAtual,

                funcaoFinalizada

            ];

        });

    }


    /* ============================
       FUNÇÃO EM ANDAMENTO
    ============================ */

    const funcaoEmAndamento =

        !!dadosFuncao.funcao &&

        (dadosFuncao.riscos || [])
            .length > 0;


    /* ============================
       ADICIONAR NOVA FUNÇÃO
    ============================ */

    function adicionarNovaFuncao() {

        if (
            (dadosFuncao.riscos || [])
                .length === 0
        ) {

            alert(

                "⚠️ Você poderá incluir uma nova função somente após finalizar completamente o cadastro da função atual."

            );

            return;

        }


        const pendentes =
            (dadosFuncao.riscos || [])
                .filter(
                    item => !item.valido
                );


        if (pendentes.length) {

            alert(

                "⚠️ Você poderá incluir uma nova função somente após finalizar completamente o cadastro da função atual."

            );

            return;

        }


        salvarFuncao();


        setDadosFuncao({

            colaborador: "",

            emContratacao: false,

            funcao: "",

            setor: "",

            tipoGHE: "",

            identificacaoGHE: "",

            descricaoAtividade: "",

            descricaoLocal: "",

            riscos: [],

            finalizada: false

        });


        setCategoria("");

        setRisco("");


        setEtapa(4);

    }


    /* ============================
       EDITAR FUNÇÃO
    ============================ */

    function editarFuncao(index) {

        if (funcaoEmAndamento) {

            alert(

                "⚠️ Finalize completamente o cadastro da função atual antes de editar outra função."

            );

            return;

        }


        const funcaoSelecionada =
            funcoes[index];


        setDadosFuncao({

            ...funcaoSelecionada

        });


        /*
         * Retira temporariamente a função
         * da lista enquanto ela está sendo
         * editada.
         */

        setFuncoes(
            (listaAtual) =>

                listaAtual.filter(
                    (_, i) => i !== index
                )

        );


        setEtapa(4);


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* ============================
       EXCLUIR FUNÇÃO
    ============================ */

    function excluirFuncao(index) {

        console.log(
            "Excluir função:",
            index
        );


        const confirmar =
            window.confirm(

                "Deseja realmente excluir esta função?"

            );


        if (!confirmar) {

            return;

        }


        setFuncoes(
            (listaAtual) => {

                console.log(
                    "Lista antes:",
                    listaAtual
                );


                const novaLista =
                    listaAtual.filter(
                        (_, i) =>
                            i !== index
                    );


                console.log(
                    "Lista depois:",
                    novaLista
                );


                return novaLista;

            }
        );

    }


    /* ============================
       CONTINUAR
    ============================ */

    function continuar() {

        if (
            (dadosFuncao.riscos || [])
                .length === 0
        ) {

            alert(
                "Cadastre pelo menos um risco."
            );

            return;

        }


        const pendentes =
            (dadosFuncao.riscos || [])
                .filter(
                    item => !item.valido
                );


        if (pendentes.length) {

            alert(

                `Existem ${pendentes.length} risco(s) pendente(s).`

            );

            return;

        }


        /*
         * IMPORTANTE:
         *
         * Aqui salvamos a versão atual
         * da função antes de ir para
         * o resumo.
         *
         * Na correção isso substitui
         * a função antiga.
         */

        salvarFuncao();


        setEtapa(6);

    }


    return (

        <div className="card">


            <h2>

                ☣ Cadastro de Riscos Ocupacionais

            </h2>


            <p className="descricao">

                Cadastre todos os riscos identificados
                para esta função.

            </p>


            <div className="linha">


                <div className="campo">

                    <label>

                        Categoria

                        <span className="obrigatorio">
                            *
                        </span>

                    </label>


                    <select

                        value={categoria}

                        onChange={
                            (e) =>
                                setCategoria(
                                    e.target.value
                                )
                        }

                    >

                        <option value="">

                            Selecione...

                        </option>


                        <option value="fisicos">

                            Físicos

                        </option>


                        <option value="quimicos">

                            Químicos

                        </option>


                        <option value="biologicos">

                            Biológicos

                        </option>


                        <option value="acidente">

                            Acidentes

                        </option>


                        <option value="ergonomico">

                            Ergonômicos

                        </option>

                    </select>

                </div>


                <div className="campo">

                    <label>

                        Risco

                        <span className="obrigatorio">
                            *
                        </span>

                    </label>


                    <AutocompleteRisco

                        categoria={
                            categoria
                        }

                        value={
                            risco
                        }

                        onChange={
                            setRisco
                        }

                    />

                </div>

            </div>


            <PainelResumoRiscos

                riscos={
                    dadosFuncao.riscos || []
                }

            />


            <FuncoesCadastradas

                funcoes={
                    funcoes
                }

                onEditar={
                    editarFuncao
                }

                onExcluir={
                    excluirFuncao
                }

            />


            <hr className="divisor" />


            <ListaRiscos

                riscos={
                    dadosFuncao.riscos || []
                }

                onExcluir={
                    excluirRisco
                }

                onAtualizar={
                    atualizarRisco
                }

            />


            <div className="rodape">


                <button

                    type="button"

                    className="cancelar"

                    onClick={
                        () => setEtapa(4)
                    }

                >

                    ← Voltar

                </button>


                <button

                    type="button"

                    onClick={
                        adicionarRisco
                    }

                    disabled={

                        !categoria ||

                        !risco.trim()

                    }

                >

                    + Adicionar risco

                </button>


                <button

                    type="button"

                    className="salvar"

                    onClick={
                        adicionarNovaFuncao
                    }

                >

                    + Adicionar Nova Função

                </button>


                <button

                    type="button"

                    className="salvar"

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


export default CadastroRiscos;