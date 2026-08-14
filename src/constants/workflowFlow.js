import { WORKFLOW_STEPS } from "./workflowSteps";
import { WORKFLOW_STATUS } from "./workflowStatus";
import { WORKFLOW_PERMISSIONS } from "./workflowPermissions";

export const WORKFLOW_FLOW = {

    SOLICITACAO: {

        etapa: WORKFLOW_STEPS.ANALISE_TECNICA,

        status: WORKFLOW_STATUS.EM_ANALISE_TECNICA,

        responsavel: WORKFLOW_PERMISSIONS.ENGENHARIA

    },

    DEVOLVER_UT: {

        etapa: WORKFLOW_STEPS.SOLICITACAO,

        status: WORKFLOW_STATUS.CORRECAO_SOLICITADA,

        responsavel: WORKFLOW_PERMISSIONS.UT

    },

    ACEITE_ENGENHARIA: {

        etapa: WORKFLOW_STEPS.ELABORACAO_PGR,

        status: WORKFLOW_STATUS.EM_ELABORACAO_PGR,

        responsavel: WORKFLOW_PERMISSIONS.SAUDE

    },

    PGR_CONCLUIDO: {

        etapa: WORKFLOW_STEPS.ELABORACAO_PCMSO,

        status: WORKFLOW_STATUS.EM_ELABORACAO_PCMSO,

        responsavel: WORKFLOW_PERMISSIONS.SAUDE

    },

    PCMSO_CONCLUIDO: {

        etapa: WORKFLOW_STEPS.CONCLUIDO,

        status: WORKFLOW_STATUS.CONCLUIDO,

        responsavel: WORKFLOW_PERMISSIONS.ADMINISTRADOR

    }

};

export default WORKFLOW_FLOW;