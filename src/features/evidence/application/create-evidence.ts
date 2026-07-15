import { getAssetDetail } from "@/src/features/assets/application/get-asset-detail";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { listAssetCaptures } from "@/src/features/captures/application/list-asset-captures";
import { evidenceRepository } from "@/src/features/evidence/infrastructure/evidence-repository";

export type CreateEvidenceErrors = {
  captureId?: string;
  file?: string;
  form?: string;
};

export type CreateEvidenceResult =
  | {
      ok: true;
      evidenceId: string;
    }
  | {
      ok: false;
      errors: CreateEvidenceErrors;
      values: {
        captureId: string;
      };
    };

export async function createEvidence(
  campaignId: string,
  assetId: string,
  input: {
    captureId: FormDataEntryValue | null;
    file: FormDataEntryValue | null;
  },
): Promise<CreateEvidenceResult> {
  const captureId = String(input.captureId ?? "").trim();
  const fileCandidate = input.file;
  const errors: CreateEvidenceErrors = {};

  const [campaign, asset, captures] = await Promise.all([
    getCampaignDetail(campaignId),
    getAssetDetail(campaignId, assetId),
    listAssetCaptures(campaignId, assetId),
  ]);

  if (!campaign || !asset) {
    errors.form = "No encontramos el activo o la campaña seleccionada.";
  } else if (!canEditCampaign(campaign.status)) {
    errors.form = "La campaña está cerrada y no admite nuevos respaldos.";
  }

  if (!captureId) {
    errors.captureId = "Seleccione la captura a la que corresponde el respaldo.";
  } else if (!captures.some((capture) => capture.id === captureId)) {
    errors.captureId = "La captura seleccionada no corresponde a este activo.";
  }

  const file = fileCandidate instanceof File ? fileCandidate : null;

  if (!file || file.size === 0) {
    errors.file = "Seleccione un archivo para registrar la evidencia.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values: {
        captureId,
      },
    };
  }

  if (!file) {
    return {
      ok: false,
      errors: {
        file: "Seleccione un archivo para registrar la evidencia.",
      },
      values: {
        captureId,
      },
    };
  }

  try {
    const evidence = await evidenceRepository.createForAsset(
      campaignId,
      assetId,
      captureId,
      file,
    );

    return {
      ok: true,
      evidenceId: evidence.id,
    };
  } catch (error) {
    return {
      ok: false,
      errors: {
        form:
          error instanceof Error
            ? error.message
            : "No fue posible registrar la evidencia.",
      },
      values: {
        captureId,
      },
    };
  }
}
