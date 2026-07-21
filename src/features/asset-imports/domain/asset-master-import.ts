export type AssetMasterImportSummary = {
  importJobId?: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  importedAssets: number;
  updatedAssets: number;
  warnings: Array<{
    row: number;
    message: string;
  }>;
  errors: Array<{
    row: number;
    message: string;
  }>;
};

export type AssetMasterImportValues = {
  fileName: string;
};

export const defaultAssetMasterImportValues: AssetMasterImportValues = {
  fileName: "",
};
