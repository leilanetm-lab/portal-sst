import { db } from "../firebase/firebaseConfig";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "firebase/firestore";


/* ============================
   BUSCAR CADASTRO
============================ */

export async function buscarCadastro(numeroUT) {

    if (!numeroUT) {

        return null;

    }


    const documento = doc(
        db,
        "CadastrosAdministrativos",
        String(numeroUT)
    );


    const cadastro =
        await getDoc(documento);


    if (cadastro.exists()) {

        return {

            id: cadastro.id,

            ...cadastro.data()

        };

    }


    return null;

}


/* ============================
   COMPARAR ALTERAÇÕES
============================ */

function compararAlteracoes(
    anterior = {},
    atual = {}
) {

    const camposIgnorados = [

        "id",

        "atualizadoEm",

        "criadoEm",

        "alteradoPorUid",

        "alteradoPorNome",

        "alteradoPorEmail"

    ];


    const campos = new Set([

        ...Object.keys(anterior || {}),

        ...Object.keys(atual || {})

    ]);


    const alteracoes = [];


    campos.forEach(
        (campo) => {


            if (
                camposIgnorados.includes(
                    campo
                )
            ) {

                return;

            }


            const valorAnterior =
                anterior?.[campo] ?? "";


            const valorAtual =
                atual?.[campo] ?? "";


            if (
                String(valorAnterior).trim()
                !==
                String(valorAtual).trim()
            ) {

                alteracoes.push({

                    campo,

                    anterior:
                        valorAnterior,

                    atual:
                        valorAtual

                });

            }

        }

    );


    return alteracoes;

}


/* ============================
   SALVAR CADASTRO
============================ */

export async function salvarCadastro(
    numeroUT,
    dados
) {

    if (!numeroUT) {

        throw new Error(
            "Número da UT não informado."
        );

    }


    const documento = doc(
        db,
        "CadastrosAdministrativos",
        String(numeroUT)
    );


    /*
    ==========================================
    VERIFICAR SE JÁ EXISTE
    ==========================================
    */

    const cadastroExistente =
        await getDoc(
            documento
        );


    const existe =
        cadastroExistente.exists();


    const dadosAnteriores =
        existe

            ?

            cadastroExistente.data()

            :

            {};


    /*
    ==========================================
    PREPARAR DADOS
    ==========================================
    */

    const dadosSalvar = {

        ...dados,

        numeroUT:
            String(numeroUT),

        atualizadoEm:
            new Date().toISOString()

    };


    /*
    ==========================================
    COMPARAR ALTERAÇÕES
    ==========================================
    */

    const alteracoes =
        compararAlteracoes(
            dadosAnteriores,
            dadosSalvar
        );


    console.log(
        "Cadastro anterior:",
        dadosAnteriores
    );


    console.log(
        "Novo cadastro:",
        dadosSalvar
    );


    console.log(
        "Alterações encontradas:",
        alteracoes
    );


    /*
    ==========================================
    SALVAR
    ==========================================
    */

    await setDoc(

        documento,

        dadosSalvar,

        {
            merge: true
        }

    );


    console.log(
        "Cadastro Administrativo salvo:",
        numeroUT
    );


    return {

        id:
            String(numeroUT),

        ...dadosSalvar,

        primeiroCadastro:
            !existe,

        houveAlteracao:
            alteracoes.length > 0,

        alteracoes

    };

}


/* ============================
   ATUALIZAR CADASTRO
============================ */

export async function atualizarCadastro(
    numeroUT,
    dados
) {

    if (!numeroUT) {

        throw new Error(
            "Número da UT não informado."
        );

    }


    const documento = doc(
        db,
        "CadastrosAdministrativos",
        String(numeroUT)
    );


    /*
    ==========================================
    BUSCAR DADOS ANTERIORES
    ==========================================
    */

    const cadastroExistente =
        await getDoc(
            documento
        );


    const dadosAnteriores =
        cadastroExistente.exists()

            ?

            cadastroExistente.data()

            :

            {};


    /*
    ==========================================
    PREPARAR DADOS
    ==========================================
    */

    const dadosAtualizar = {

        ...dados,

        numeroUT:
            String(numeroUT),

        atualizadoEm:
            new Date().toISOString()

    };


    /*
    ==========================================
    IDENTIFICAR ALTERAÇÕES
    ==========================================
    */

    const alteracoes =
        compararAlteracoes(
            dadosAnteriores,
            dadosAtualizar
        );


    console.log(
        "Alterações encontradas:",
        alteracoes
    );


    /*
    ==========================================
    ATUALIZAR
    ==========================================
    */

    await updateDoc(

        documento,

        dadosAtualizar

    );


    console.log(
        "Cadastro Administrativo atualizado:",
        numeroUT
    );


    return {

        id:
            String(numeroUT),

        ...dadosAtualizar,

        primeiroCadastro:
            false,

        houveAlteracao:
            alteracoes.length > 0,

        alteracoes

    };

}