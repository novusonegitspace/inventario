BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[tenants] (
    [id] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [tenants_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [tenants_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [tenants_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [tenants_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [display_name] NVARCHAR(1000),
    [entra_object_id] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [users_entra_object_id_key] UNIQUE NONCLUSTERED ([entra_object_id])
);

-- CreateTable
CREATE TABLE [dbo].[tenant_users] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [tenant_users_is_active_df] DEFAULT 1,
    [joined_at] DATETIME2 NOT NULL CONSTRAINT [tenant_users_joined_at_df] DEFAULT CURRENT_TIMESTAMP,
    [last_seen_at] DATETIME2,
    CONSTRAINT [tenant_users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [tenant_users_tenant_id_user_id_key] UNIQUE NONCLUSTERED ([tenant_id],[user_id])
);

-- CreateTable
CREATE TABLE [dbo].[clients] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [clients_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [clients_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [clients_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [clients_tenant_id_code_key] UNIQUE NONCLUSTERED ([tenant_id],[code])
);

-- CreateTable
CREATE TABLE [dbo].[campaigns] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [client_id] NVARCHAR(1000),
    [created_by_id] NVARCHAR(1000),
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [site_name] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [campaigns_status_df] DEFAULT 'DRAFT',
    [inventory_mode] NVARCHAR(1000) NOT NULL CONSTRAINT [campaigns_inventory_mode_df] DEFAULT 'FULL_COUNT',
    [progress_percentage] INT NOT NULL CONSTRAINT [campaigns_progress_percentage_df] DEFAULT 0,
    [scheduled_start_at] DATETIME2,
    [scheduled_end_at] DATETIME2,
    [started_at] DATETIME2,
    [closed_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [campaigns_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [campaigns_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [campaigns_tenant_id_code_key] UNIQUE NONCLUSTERED ([tenant_id],[code])
);

-- CreateTable
CREATE TABLE [dbo].[campaign_settings] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [capture_requires_photo] BIT NOT NULL CONSTRAINT [campaign_settings_capture_requires_photo_df] DEFAULT 0,
    [capture_requires_geo] BIT NOT NULL CONSTRAINT [campaign_settings_capture_requires_geo_df] DEFAULT 0,
    [allow_manual_assets] BIT NOT NULL CONSTRAINT [campaign_settings_allow_manual_assets_df] DEFAULT 0,
    [close_blocks_captures] BIT NOT NULL CONSTRAINT [campaign_settings_close_blocks_captures_df] DEFAULT 1,
    [notes] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [campaign_settings_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [campaign_settings_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [campaign_settings_campaign_id_key] UNIQUE NONCLUSTERED ([campaign_id])
);

-- CreateTable
CREATE TABLE [dbo].[campaign_inventory_fields] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [key] NVARCHAR(1000) NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [data_type] NVARCHAR(1000) NOT NULL,
    [is_required] BIT NOT NULL CONSTRAINT [campaign_inventory_fields_is_required_df] DEFAULT 0,
    [is_visible] BIT NOT NULL CONSTRAINT [campaign_inventory_fields_is_visible_df] DEFAULT 1,
    [position] INT NOT NULL CONSTRAINT [campaign_inventory_fields_position_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [campaign_inventory_fields_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [campaign_inventory_fields_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [campaign_inventory_fields_campaign_id_key_key] UNIQUE NONCLUSTERED ([campaign_id],[key])
);

-- CreateTable
CREATE TABLE [dbo].[campaign_reconciliation_criteria] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [is_enabled] BIT NOT NULL CONSTRAINT [campaign_reconciliation_criteria_is_enabled_df] DEFAULT 1,
    [position] INT NOT NULL CONSTRAINT [campaign_reconciliation_criteria_position_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [campaign_reconciliation_criteria_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [campaign_reconciliation_criteria_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [campaign_reconciliation_criteria_campaign_id_code_key] UNIQUE NONCLUSTERED ([campaign_id],[code])
);

-- CreateTable
CREATE TABLE [dbo].[asset_master_rows] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [import_job_id] NVARCHAR(1000),
    [row_number] INT NOT NULL,
    [asset_tag] NVARCHAR(1000) NOT NULL,
    [asset_name] NVARCHAR(1000) NOT NULL,
    [serial_number] NVARCHAR(1000),
    [location] NVARCHAR(1000),
    [responsible] NVARCHAR(1000),
    [cost_center] NVARCHAR(1000),
    [source_reference] NVARCHAR(1000),
    [imported_at] DATETIME2 NOT NULL CONSTRAINT [asset_master_rows_imported_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [asset_master_rows_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [asset_master_rows_tenant_id_campaign_id_row_number_key] UNIQUE NONCLUSTERED ([tenant_id],[campaign_id],[row_number])
);

-- CreateTable
CREATE TABLE [dbo].[assets] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [asset_master_row_id] NVARCHAR(1000),
    [asset_tag] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [serial_number] NVARCHAR(1000),
    [location] NVARCHAR(1000),
    [responsible] NVARCHAR(1000),
    [cost_center] NVARCHAR(1000),
    [is_active] BIT NOT NULL CONSTRAINT [assets_is_active_df] DEFAULT 1,
    [latest_capture_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [assets_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [assets_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [assets_asset_master_row_id_key] UNIQUE NONCLUSTERED ([asset_master_row_id]),
    CONSTRAINT [assets_tenant_id_campaign_id_asset_tag_key] UNIQUE NONCLUSTERED ([tenant_id],[campaign_id],[asset_tag])
);

-- CreateTable
CREATE TABLE [dbo].[campaign_auditors] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [assigned_at] DATETIME2 NOT NULL CONSTRAINT [campaign_auditors_assigned_at_df] DEFAULT CURRENT_TIMESTAMP,
    [removed_at] DATETIME2,
    CONSTRAINT [campaign_auditors_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [campaign_auditors_tenant_id_campaign_id_user_id_key] UNIQUE NONCLUSTERED ([tenant_id],[campaign_id],[user_id])
);

-- CreateTable
CREATE TABLE [dbo].[assignments] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [asset_id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [assignments_status_df] DEFAULT 'PENDING',
    [note] NVARCHAR(1000),
    [assigned_at] DATETIME2 NOT NULL CONSTRAINT [assignments_assigned_at_df] DEFAULT CURRENT_TIMESTAMP,
    [completed_at] DATETIME2,
    CONSTRAINT [assignments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [assignments_campaign_id_asset_id_user_id_key] UNIQUE NONCLUSTERED ([campaign_id],[asset_id],[user_id])
);

-- CreateTable
CREATE TABLE [dbo].[asset_captures] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [asset_id] NVARCHAR(1000),
    [submitted_by_id] NVARCHAR(1000),
    [scanned_code] NVARCHAR(1000) NOT NULL,
    [latitude] DECIMAL(32,16),
    [longitude] DECIMAL(32,16),
    [notes] NVARCHAR(1000),
    [captured_at] DATETIME2 NOT NULL CONSTRAINT [asset_captures_captured_at_df] DEFAULT CURRENT_TIMESTAMP,
    [device_label] NVARCHAR(1000),
    CONSTRAINT [asset_captures_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[asset_capture_conditions] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [capture_id] NVARCHAR(1000) NOT NULL,
    [physical_condition] NVARCHAR(1000),
    [observed_location] NVARCHAR(1000),
    [observed_responsible] NVARCHAR(1000),
    [observed_cost_center] NVARCHAR(1000),
    [observed_serial_number] NVARCHAR(1000),
    [notes] NVARCHAR(1000),
    CONSTRAINT [asset_capture_conditions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [asset_capture_conditions_capture_id_key] UNIQUE NONCLUSTERED ([capture_id])
);

-- CreateTable
CREATE TABLE [dbo].[evidence_files] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [asset_id] NVARCHAR(1000),
    [capture_id] NVARCHAR(1000),
    [uploaded_by_id] NVARCHAR(1000),
    [sha256] NVARCHAR(1000) NOT NULL,
    [original_file_name] NVARCHAR(1000) NOT NULL,
    [blob_path] NVARCHAR(1000) NOT NULL,
    [mime_type] NVARCHAR(1000) NOT NULL,
    [size_bytes] BIGINT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [evidence_files_status_df] DEFAULT 'UPLOADED_PENDING_SCAN',
    [uploaded_at] DATETIME2 NOT NULL CONSTRAINT [evidence_files_uploaded_at_df] DEFAULT CURRENT_TIMESTAMP,
    [available_at] DATETIME2,
    CONSTRAINT [evidence_files_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [evidence_files_tenant_id_sha256_key] UNIQUE NONCLUSTERED ([tenant_id],[sha256])
);

-- CreateTable
CREATE TABLE [dbo].[reconciliation_results] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [asset_id] NVARCHAR(1000),
    [capture_id] NVARCHAR(1000),
    [reviewed_by_id] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [reconciliation_results_status_df] DEFAULT 'PENDING',
    [snapshot_version] INT NOT NULL CONSTRAINT [reconciliation_results_snapshot_version_df] DEFAULT 1,
    [matched_by_code] BIT NOT NULL CONSTRAINT [reconciliation_results_matched_by_code_df] DEFAULT 0,
    [location_matches] BIT,
    [responsible_matches] BIT,
    [physical_condition_matches] BIT,
    [cost_center_matches] BIT,
    [serial_number_matches] BIT,
    [notes] NVARCHAR(1000),
    [reviewed_at] DATETIME2,
    [calculated_at] DATETIME2 NOT NULL CONSTRAINT [reconciliation_results_calculated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [reconciliation_results_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[findings] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [asset_id] NVARCHAR(1000),
    [reconciliation_result_id] NVARCHAR(1000),
    [created_by_id] NVARCHAR(1000),
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [severity] NVARCHAR(1000) NOT NULL CONSTRAINT [findings_severity_df] DEFAULT 'MEDIUM',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [findings_status_df] DEFAULT 'OPEN',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [findings_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [resolved_at] DATETIME2,
    CONSTRAINT [findings_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[business_timeline_events] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000) NOT NULL,
    [actor_user_id] NVARCHAR(1000),
    [type] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [occurred_at] DATETIME2 NOT NULL CONSTRAINT [business_timeline_events_occurred_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [business_timeline_events_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[audit_log] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000),
    [actor_user_id] NVARCHAR(1000),
    [entity_type] NVARCHAR(1000) NOT NULL,
    [entity_id] NVARCHAR(1000) NOT NULL,
    [action] NVARCHAR(1000) NOT NULL,
    [before_state] NVARCHAR(1000),
    [after_state] NVARCHAR(1000),
    [request_id] NVARCHAR(1000),
    [occurred_at] DATETIME2 NOT NULL CONSTRAINT [audit_log_occurred_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [audit_log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[import_jobs] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000),
    [requested_by_id] NVARCHAR(1000),
    [kind] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [import_jobs_status_df] DEFAULT 'QUEUED',
    [source_file_name] NVARCHAR(1000) NOT NULL,
    [source_blob_path] NVARCHAR(1000),
    [total_rows] INT,
    [processed_rows] INT,
    [error_message] NVARCHAR(1000),
    [started_at] DATETIME2,
    [completed_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [import_jobs_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [import_jobs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[export_jobs] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [campaign_id] NVARCHAR(1000),
    [requested_by_id] NVARCHAR(1000),
    [kind] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [export_jobs_status_df] DEFAULT 'QUEUED',
    [output_file_name] NVARCHAR(1000),
    [output_blob_path] NVARCHAR(1000),
    [error_message] NVARCHAR(1000),
    [started_at] DATETIME2,
    [completed_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [export_jobs_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [export_jobs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tenant_users_tenant_id_role_idx] ON [dbo].[tenant_users]([tenant_id], [role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tenant_users_user_id_idx] ON [dbo].[tenant_users]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [clients_tenant_id_idx] ON [dbo].[clients]([tenant_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaigns_tenant_id_status_idx] ON [dbo].[campaigns]([tenant_id], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaigns_tenant_id_client_id_idx] ON [dbo].[campaigns]([tenant_id], [client_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaigns_client_id_idx] ON [dbo].[campaigns]([client_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaigns_created_by_id_idx] ON [dbo].[campaigns]([created_by_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaign_settings_tenant_id_campaign_id_idx] ON [dbo].[campaign_settings]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaign_inventory_fields_tenant_id_campaign_id_idx] ON [dbo].[campaign_inventory_fields]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaign_reconciliation_criteria_tenant_id_campaign_id_idx] ON [dbo].[campaign_reconciliation_criteria]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_master_rows_tenant_id_campaign_id_idx] ON [dbo].[asset_master_rows]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_master_rows_tenant_id_campaign_id_asset_tag_idx] ON [dbo].[asset_master_rows]([tenant_id], [campaign_id], [asset_tag]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_master_rows_campaign_id_idx] ON [dbo].[asset_master_rows]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_master_rows_import_job_id_idx] ON [dbo].[asset_master_rows]([import_job_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assets_tenant_id_campaign_id_idx] ON [dbo].[assets]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assets_campaign_id_idx] ON [dbo].[assets]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaign_auditors_tenant_id_campaign_id_idx] ON [dbo].[campaign_auditors]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaign_auditors_campaign_id_idx] ON [dbo].[campaign_auditors]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [campaign_auditors_user_id_idx] ON [dbo].[campaign_auditors]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assignments_tenant_id_campaign_id_idx] ON [dbo].[assignments]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assignments_asset_id_idx] ON [dbo].[assignments]([asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assignments_user_id_idx] ON [dbo].[assignments]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_captures_tenant_id_campaign_id_idx] ON [dbo].[asset_captures]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_captures_tenant_id_campaign_id_asset_id_idx] ON [dbo].[asset_captures]([tenant_id], [campaign_id], [asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_captures_campaign_id_idx] ON [dbo].[asset_captures]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_captures_asset_id_idx] ON [dbo].[asset_captures]([asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_captures_submitted_by_id_idx] ON [dbo].[asset_captures]([submitted_by_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_capture_conditions_tenant_id_campaign_id_idx] ON [dbo].[asset_capture_conditions]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [asset_capture_conditions_campaign_id_idx] ON [dbo].[asset_capture_conditions]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_tenant_id_campaign_id_idx] ON [dbo].[evidence_files]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_tenant_id_campaign_id_asset_id_idx] ON [dbo].[evidence_files]([tenant_id], [campaign_id], [asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_tenant_id_campaign_id_capture_id_idx] ON [dbo].[evidence_files]([tenant_id], [campaign_id], [capture_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_campaign_id_idx] ON [dbo].[evidence_files]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_asset_id_idx] ON [dbo].[evidence_files]([asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_capture_id_idx] ON [dbo].[evidence_files]([capture_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [evidence_files_uploaded_by_id_idx] ON [dbo].[evidence_files]([uploaded_by_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_tenant_id_campaign_id_idx] ON [dbo].[reconciliation_results]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_tenant_id_campaign_id_asset_id_idx] ON [dbo].[reconciliation_results]([tenant_id], [campaign_id], [asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_tenant_id_campaign_id_capture_id_idx] ON [dbo].[reconciliation_results]([tenant_id], [campaign_id], [capture_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_campaign_id_idx] ON [dbo].[reconciliation_results]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_asset_id_idx] ON [dbo].[reconciliation_results]([asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_capture_id_idx] ON [dbo].[reconciliation_results]([capture_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reconciliation_results_reviewed_by_id_idx] ON [dbo].[reconciliation_results]([reviewed_by_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [findings_tenant_id_campaign_id_idx] ON [dbo].[findings]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [findings_campaign_id_idx] ON [dbo].[findings]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [findings_asset_id_idx] ON [dbo].[findings]([asset_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [findings_reconciliation_result_id_idx] ON [dbo].[findings]([reconciliation_result_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [findings_created_by_id_idx] ON [dbo].[findings]([created_by_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [business_timeline_events_tenant_id_campaign_id_occurred_at_idx] ON [dbo].[business_timeline_events]([tenant_id], [campaign_id], [occurred_at]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [business_timeline_events_campaign_id_idx] ON [dbo].[business_timeline_events]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [business_timeline_events_actor_user_id_idx] ON [dbo].[business_timeline_events]([actor_user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_log_tenant_id_campaign_id_occurred_at_idx] ON [dbo].[audit_log]([tenant_id], [campaign_id], [occurred_at]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_log_campaign_id_idx] ON [dbo].[audit_log]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_log_actor_user_id_idx] ON [dbo].[audit_log]([actor_user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [import_jobs_tenant_id_campaign_id_idx] ON [dbo].[import_jobs]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [import_jobs_tenant_id_status_idx] ON [dbo].[import_jobs]([tenant_id], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [import_jobs_campaign_id_idx] ON [dbo].[import_jobs]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [import_jobs_requested_by_id_idx] ON [dbo].[import_jobs]([requested_by_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [export_jobs_tenant_id_campaign_id_idx] ON [dbo].[export_jobs]([tenant_id], [campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [export_jobs_tenant_id_status_idx] ON [dbo].[export_jobs]([tenant_id], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [export_jobs_campaign_id_idx] ON [dbo].[export_jobs]([campaign_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [export_jobs_requested_by_id_idx] ON [dbo].[export_jobs]([requested_by_id]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
