import "server-only";

import { readSheet } from "read-excel-file/node";

import {
  normalizeAssetTag,
  normalizeBarcode,
} from "@/src/features/assets/domain/asset";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import {
  defaultAssetMasterImportValues,
  type AssetMasterImportSummary,
  type AssetMasterImportValues,
} from "@/src/features/asset-imports/domain/asset-master-import";
import { prisma } from "@/src/lib/db/prisma";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const MAX_ROWS = 20_000;

type ParsedRow = {
  rowNumber: number;
  assetTag: string;
  barcode: string;
  assetName: string;
  serialNumber: string;
  location: string;
  responsible: string;
  costCenter: string;
  sourceReference: string;
  warnings: string[];
  errors: string[];
};

type AssetMasterColumn =
  | "assetTag"
  | "barcode"
  | "assetName"
  | "serialNumber"
  | "location"
  | "responsible"
  | "costCenter"
  | "sourceReference";

export type AssetMasterImportErrors = {
  file?: string;
  form?: string;
};

export type AssetMasterImportResult =
  | {
      ok: true;
      message: string;
      summary: AssetMasterImportSummary;
      values: AssetMasterImportValues;
    }
  | {
      ok: false;
      errors: AssetMasterImportErrors;
      summary?: AssetMasterImportSummary;
      values: AssetMasterImportValues;
    };

const columnAliases: Record<string, AssetMasterColumn> = {
  activo: "assetTag",
  assetcode: "assetTag",
  assetid: "assetTag",
  assettag: "assetTag",
  codigo: "assetTag",
  codigoactivo: "assetTag",
  codigodelactivo: "assetTag",
  codigointerno: "assetTag",
  etiqueta: "assetTag",
  etiquetainterna: "assetTag",
  idactivo: "assetTag",
  tag: "assetTag",

  barcode: "barcode",
  codigobarras: "barcode",
  codigodebarra: "barcode",
  codigodebarras: "barcode",
  qr: "barcode",

  assetname: "assetName",
  descripcion: "assetName",
  nombre: "assetName",
  nombreactivo: "assetName",
  producto: "assetName",

  numerodeserie: "serialNumber",
  serie: "serialNumber",
  serial: "serialNumber",
  serialnumber: "serialNumber",

  location: "location",
  ubicacion: "location",
  ubicacionesperada: "location",
  sede: "location",
  sitio: "location",

  responsable: "responsible",
  responsableesperado: "responsible",
  custodio: "responsible",

  centrocosto: "costCenter",
  centrodecosto: "costCenter",
  costcenter: "costCenter",

  referencia: "sourceReference",
  sourcereference: "sourceReference",
  origen: "sourceReference",
};

function normalizeColumnName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function toCellString(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function parseCsvText(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);

  if (currentRow.some((cell) => cell.trim())) {
    rows.push(currentRow);
  }

  return rows;
}

function rowsToObjects(rows: string[][]) {
  const headers = rows[0]?.map((header) => header.trim()) ?? [];

  return rows
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => {
      return Object.fromEntries(
        headers.map((header, index) => [header, row[index] ?? ""]),
      );
    });
}

function isCsvFile(file: File) {
  return (
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/csv"
  );
}

async function parseRows(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isCsvFile(file)) {
    return rowsToObjects(parseCsvText(buffer.toString("utf8")));
  }

  const rows = await readSheet(buffer);
  return rowsToObjects(
    rows.map((row) => row.map((cell) => toCellString(cell))),
  );
}

function mapRow(
  row: Record<string, unknown>,
  rowIndex: number,
  seenAssetTags: Set<string>,
  seenBarcodes: Set<string>,
): ParsedRow {
  const mapped: Record<AssetMasterColumn, string> = {
    assetTag: "",
    barcode: "",
    assetName: "",
    serialNumber: "",
    location: "",
    responsible: "",
    costCenter: "",
    sourceReference: "",
  };

  for (const [columnName, value] of Object.entries(row)) {
    const target = columnAliases[normalizeColumnName(columnName)];

    if (target && !mapped[target]) {
      mapped[target] = toCellString(value);
    }
  }

  const assetTag = normalizeAssetTag(mapped.assetTag);
  const barcode = normalizeBarcode(mapped.barcode);
  const assetName = mapped.assetName.trim();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!assetTag) {
    errors.push("Falta el código del activo.");
  } else if (seenAssetTags.has(assetTag)) {
    errors.push(`Código de activo duplicado en el archivo: ${assetTag}.`);
  } else {
    seenAssetTags.add(assetTag);
  }

  if (!assetName) {
    errors.push("Falta la descripción o nombre del activo.");
  }

  if (barcode) {
    if (seenBarcodes.has(barcode)) {
      warnings.push(`Código de barras repetido en el archivo: ${barcode}.`);
    } else {
      seenBarcodes.add(barcode);
    }
  } else {
    warnings.push("Sin código de barras; se usará la etiqueta interna para escanear.");
  }

  if (!mapped.location.trim()) {
    warnings.push("Sin ubicación esperada.");
  }

  if (!mapped.responsible.trim()) {
    warnings.push("Sin responsable esperado.");
  }

  return {
    rowNumber: rowIndex + 2,
    assetTag,
    barcode,
    assetName,
    serialNumber: mapped.serialNumber.trim(),
    location: mapped.location.trim(),
    responsible: mapped.responsible.trim(),
    costCenter: mapped.costCenter.trim(),
    sourceReference: mapped.sourceReference.trim(),
    warnings,
    errors,
  };
}

function buildSummary(
  fileName: string,
  rows: ParsedRow[],
  importedAssets = 0,
  updatedAssets = 0,
  importJobId?: string,
): AssetMasterImportSummary {
  const invalidRows = rows.filter((row) => row.errors.length > 0);
  const warningRows = rows.filter((row) => row.warnings.length > 0);

  return {
    importJobId,
    fileName,
    totalRows: rows.length,
    validRows: rows.length - invalidRows.length,
    warningRows: warningRows.length,
    errorRows: invalidRows.length,
    importedAssets,
    updatedAssets,
    warnings: warningRows
      .flatMap((row) =>
        row.warnings.map((message) => ({
          row: row.rowNumber,
          message,
        })),
      )
      .slice(0, 8),
    errors: invalidRows
      .flatMap((row) =>
        row.errors.map((message) => ({
          row: row.rowNumber,
          message,
        })),
      )
      .slice(0, 8),
  };
}

function getFileValues(file: File | null): AssetMasterImportValues {
  return {
    ...defaultAssetMasterImportValues,
    fileName: file?.name ?? "",
  };
}

export async function importAssetMaster(
  campaignId: string,
  fileValue: FormDataEntryValue | null,
): Promise<AssetMasterImportResult> {
  const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : null;
  const values = getFileValues(file);

  if (!file) {
    return {
      ok: false,
      errors: {
        file: "Seleccione un archivo CSV o Excel para importar.",
      },
      values,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      errors: {
        file: "El archivo supera el máximo permitido de 50 MB.",
      },
      values,
    };
  }

  const context = await getRequiredAuthContext();
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      status: true,
      tenantId: true,
    },
  });

  if (!campaign) {
    return {
      ok: false,
      errors: {
        form: "No encontramos la campaña seleccionada.",
      },
      values,
    };
  }

  if (campaign.status === "CLOSED") {
    return {
      ok: false,
      errors: {
        form: "La campaña está cerrada y no admite carga de maestro.",
      },
      values,
    };
  }

  let rawRows: Array<Record<string, unknown>>;

  try {
    rawRows = await parseRows(file);
  } catch {
    return {
      ok: false,
      errors: {
        file: "No pudimos leer el archivo. Use CSV o XLSX con encabezados.",
      },
      values,
    };
  }

  if (rawRows.length === 0) {
    return {
      ok: false,
      errors: {
        file: "El archivo no contiene filas para importar.",
      },
      values,
    };
  }

  if (rawRows.length > MAX_ROWS) {
    return {
      ok: false,
      errors: {
        file: `El archivo tiene ${rawRows.length} filas. El máximo por carga es ${MAX_ROWS}.`,
      },
      values,
    };
  }

  const seenAssetTags = new Set<string>();
  const seenBarcodes = new Set<string>();
  const rows = rawRows.map((row, index) =>
    mapRow(row, index, seenAssetTags, seenBarcodes),
  );
  const validRows = rows.filter((row) => row.errors.length === 0);
  const summaryBeforeImport = buildSummary(file.name, rows);

  if (validRows.length === 0) {
    await prisma.importJob.create({
      data: {
        tenantId: context.tenantId,
        campaignId,
        requestedById: context.userId,
        kind: "ASSET_MASTER",
        status: "FAILED",
        sourceFileName: `${Date.now()}-${file.name}`,
        originalFileName: file.name,
        fileSizeBytes: BigInt(file.size),
        totalRows: rows.length,
        processedRows: 0,
        validRows: 0,
        warningRows: summaryBeforeImport.warningRows,
        errorRows: summaryBeforeImport.errorRows,
        validationSummaryJson: JSON.stringify(summaryBeforeImport),
        errorMessage: "El archivo no contiene filas válidas.",
        startedAt: new Date(),
        validatedAt: new Date(),
        completedAt: new Date(),
      },
    });

    return {
      ok: false,
      errors: {
        file: "El archivo no tiene filas válidas para importar.",
      },
      summary: summaryBeforeImport,
      values,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const importJob = await tx.importJob.create({
      data: {
        tenantId: context.tenantId,
        campaignId,
        requestedById: context.userId,
        kind: "ASSET_MASTER",
        status: "RUNNING",
        sourceFileName: `${Date.now()}-${file.name}`,
        originalFileName: file.name,
        fileSizeBytes: BigInt(file.size),
        totalRows: rows.length,
        processedRows: 0,
        validRows: summaryBeforeImport.validRows,
        warningRows: summaryBeforeImport.warningRows,
        errorRows: summaryBeforeImport.errorRows,
        validationSummaryJson: JSON.stringify(summaryBeforeImport),
        startedAt: new Date(),
        validatedAt: new Date(),
      },
    });

    let nextRowNumber = await tx.assetMasterRow.count({
      where: {
        tenantId: context.tenantId,
        campaignId,
      },
    });
    let importedAssets = 0;
    let updatedAssets = 0;

    for (const row of validRows) {
      nextRowNumber += 1;

      const existingAsset = await tx.asset.findUnique({
        where: {
          tenantId_campaignId_assetTag: {
            tenantId: context.tenantId,
            campaignId,
            assetTag: row.assetTag,
          },
        },
        select: {
          id: true,
        },
      });

      const masterRow = await tx.assetMasterRow.create({
        data: {
          tenantId: context.tenantId,
          campaignId,
          importJobId: importJob.id,
          rowNumber: nextRowNumber,
          assetTag: row.assetTag,
          barcode: row.barcode || null,
          assetName: row.assetName,
          serialNumber: row.serialNumber || null,
          location: row.location || null,
          responsible: row.responsible || null,
          costCenter: row.costCenter || null,
          sourceReference: row.sourceReference || null,
        },
      });

      await tx.asset.upsert({
        where: {
          tenantId_campaignId_assetTag: {
            tenantId: context.tenantId,
            campaignId,
            assetTag: row.assetTag,
          },
        },
        update: {
          assetMasterRowId: masterRow.id,
          barcode: row.barcode || null,
          name: row.assetName,
          serialNumber: row.serialNumber || null,
          location: row.location || null,
          responsible: row.responsible || null,
          costCenter: row.costCenter || null,
          isActive: true,
        },
        create: {
          tenantId: context.tenantId,
          campaignId,
          assetMasterRowId: masterRow.id,
          assetTag: row.assetTag,
          barcode: row.barcode || null,
          name: row.assetName,
          serialNumber: row.serialNumber || null,
          location: row.location || null,
          responsible: row.responsible || null,
          costCenter: row.costCenter || null,
        },
      });

      if (existingAsset) {
        updatedAssets += 1;
      } else {
        importedAssets += 1;
      }
    }

    const summary = buildSummary(
      file.name,
      rows,
      importedAssets,
      updatedAssets,
      importJob.id,
    );

    await tx.importJob.update({
      where: {
        id: importJob.id,
      },
      data: {
        status: "SUCCEEDED",
        processedRows: validRows.length,
        validRows: summary.validRows,
        warningRows: summary.warningRows,
        errorRows: summary.errorRows,
        validationSummaryJson: JSON.stringify(summary),
        confirmedAt: new Date(),
        completedAt: new Date(),
      },
    });

    return summary;
  });

  return {
    ok: true,
    message:
      result.updatedAssets > 0
        ? `Maestro importado: ${result.importedAssets} activos nuevos y ${result.updatedAssets} actualizados.`
        : `Maestro importado: ${result.importedAssets} activos creados.`,
    summary: result,
    values,
  };
}
