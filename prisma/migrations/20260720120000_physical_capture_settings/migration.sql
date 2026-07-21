BEGIN TRY

BEGIN TRAN;

-- Normalize campaign inventory modes to the capture modes used by the product.
UPDATE [dbo].[campaigns]
SET [inventory_mode] = 'SIMPLE_COUNT'
WHERE [inventory_mode] = 'FULL_COUNT';

UPDATE [dbo].[campaigns]
SET [inventory_mode] = 'CUSTOM'
WHERE [inventory_mode] = 'SELECTIVE';

UPDATE [dbo].[campaigns]
SET [inventory_mode] = 'FULL_AUDIT'
WHERE [inventory_mode] = 'CYCLE_COUNT';

ALTER TABLE [dbo].[campaigns] DROP CONSTRAINT [campaigns_inventory_mode_df];
ALTER TABLE [dbo].[campaigns] ADD CONSTRAINT [campaigns_inventory_mode_df] DEFAULT 'SIMPLE_COUNT' FOR [inventory_mode];

-- Extend campaign settings with physical capture configuration.
ALTER TABLE [dbo].[campaign_settings] ADD
    [asset_management_method] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_settings_asset_management_method_df] DEFAULT 'BULK_ONLY',
    [allow_offline_capture] BIT NOT NULL CONSTRAINT [campaign_settings_allow_offline_capture_df] DEFAULT 1,
    [allow_edit_records] BIT NOT NULL CONSTRAINT [campaign_settings_allow_edit_records_df] DEFAULT 1,
    [require_supervisor_review] BIT NOT NULL CONSTRAINT [campaign_settings_require_supervisor_review_df] DEFAULT 1,
    [auto_close_campaign] BIT NOT NULL CONSTRAINT [campaign_settings_auto_close_campaign_df] DEFAULT 0,
    [allow_surplus_assets] BIT NOT NULL CONSTRAINT [campaign_settings_allow_surplus_assets_df] DEFAULT 0,
    [manual_asset_limit] INT,
    [primary_photo_requirement] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_settings_primary_photo_requirement_df] DEFAULT 'OPTIONAL',
    [additional_photos_requirement] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_settings_additional_photos_requirement_df] DEFAULT 'OPTIONAL',
    [additional_photos_min] INT NOT NULL CONSTRAINT [campaign_settings_additional_photos_min_df] DEFAULT 0,
    [other_files_requirement] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_settings_other_files_requirement_df] DEFAULT 'OPTIONAL',
    [photo_observation_rule] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_settings_photo_observation_rule_df] DEFAULT 'OPTIONAL',
    [condition_options_json] NVARCHAR(1000),
    [condition_requires_observation_rule] NVARCHAR(1000);

EXEC(N'
UPDATE [dbo].[campaign_settings]
SET
    [primary_photo_requirement] = CASE WHEN [capture_requires_photo] = 1 THEN ''REQUIRED'' ELSE ''OPTIONAL'' END,
    [asset_management_method] = CASE WHEN [allow_manual_assets] = 1 THEN ''HYBRID'' ELSE ''BULK_ONLY'' END,
    [allow_edit_records] = CASE WHEN [close_blocks_captures] = 1 THEN 0 ELSE 1 END,
    [condition_requires_observation_rule] = ''difference_or_bad_condition'';
');

-- Extend configurable capture fields.
ALTER TABLE [dbo].[campaign_inventory_fields] ADD
    [requirement] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_inventory_fields_requirement_df] DEFAULT 'OPTIONAL',
    [help_text] NVARCHAR(1000),
    [options_json] NVARCHAR(1000),
    [default_value] NVARCHAR(1000),
    [show_in_mobile_capture] BIT NOT NULL CONSTRAINT [campaign_inventory_fields_show_in_mobile_capture_df] DEFAULT 1,
    [show_in_asset_detail] BIT NOT NULL CONSTRAINT [campaign_inventory_fields_show_in_asset_detail_df] DEFAULT 1,
    [show_in_reports] BIT NOT NULL CONSTRAINT [campaign_inventory_fields_show_in_reports_df] DEFAULT 1,
    [visibility_condition_json] NVARCHAR(1000),
    [is_system] BIT NOT NULL CONSTRAINT [campaign_inventory_fields_is_system_df] DEFAULT 0,
    [scope] NVARCHAR(1000) NOT NULL CONSTRAINT [campaign_inventory_fields_scope_df] DEFAULT 'CAPTURE';

EXEC(N'
UPDATE [dbo].[campaign_inventory_fields]
SET [requirement] = CASE WHEN [is_required] = 1 THEN ''REQUIRED'' ELSE ''OPTIONAL'' END;
');

-- Add import validation metadata for asset master uploads.
ALTER TABLE [dbo].[import_jobs] ADD
    [original_file_name] NVARCHAR(1000),
    [file_size_bytes] BIGINT,
    [valid_rows] INT,
    [warning_rows] INT,
    [error_rows] INT,
    [validation_summary_json] NVARCHAR(1000),
    [validated_at] DATETIME2,
    [confirmed_at] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
