-- Allow multiple manually created assets in the same campaign.
-- SQL Server unique constraints only allow one NULL value, so the old
-- asset_master_row_id unique constraint blocked the second manual asset.
DECLARE @constraintName NVARCHAR(128);

SELECT TOP 1
    @constraintName = kc.[name]
FROM sys.key_constraints kc
INNER JOIN sys.tables t
    ON kc.parent_object_id = t.object_id
INNER JOIN sys.schemas s
    ON t.schema_id = s.schema_id
INNER JOIN sys.index_columns ic
    ON kc.parent_object_id = ic.object_id
    AND kc.unique_index_id = ic.index_id
INNER JOIN sys.columns c
    ON ic.object_id = c.object_id
    AND ic.column_id = c.column_id
WHERE kc.[type] = 'UQ'
    AND s.[name] = N'dbo'
    AND t.[name] = N'assets'
    AND c.[name] = N'asset_master_row_id';

IF @constraintName IS NOT NULL
BEGIN
    DECLARE @dropConstraintSql NVARCHAR(MAX);
    SET @dropConstraintSql =
        N'ALTER TABLE [dbo].[assets] DROP CONSTRAINT [' +
        REPLACE(@constraintName, N']', N']]') +
        N']';

    EXEC sp_executesql @dropConstraintSql;
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes i
    INNER JOIN sys.tables t
        ON i.object_id = t.object_id
    INNER JOIN sys.schemas s
        ON t.schema_id = s.schema_id
    WHERE s.[name] = N'dbo'
        AND t.[name] = N'assets'
        AND i.[name] = N'assets_asset_master_row_id_idx'
)
BEGIN
    CREATE NONCLUSTERED INDEX [assets_asset_master_row_id_idx]
        ON [dbo].[assets]([asset_master_row_id]);
END;
