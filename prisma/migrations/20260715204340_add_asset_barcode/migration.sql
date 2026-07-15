BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[asset_master_rows] ADD [barcode] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[assets] ADD [barcode] NVARCHAR(1000);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_master_rows_tenant_id_campaign_id_barcode_idx] ON [dbo].[asset_master_rows]([tenant_id], [campaign_id], [barcode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assets_tenant_id_campaign_id_barcode_idx] ON [dbo].[assets]([tenant_id], [campaign_id], [barcode]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
