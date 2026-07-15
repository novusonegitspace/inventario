export const tenantUserRoles = [
  "TENANT_ADMIN",
  "PROJECT_LEAD",
  "SUPERVISOR",
  "FIELD_AUDITOR",
  "CLIENT",
] as const;

export type TenantUserRole = (typeof tenantUserRoles)[number];

export const campaignStatuses = ["DRAFT", "ACTIVE", "CLOSED"] as const;

export type CampaignStatus = (typeof campaignStatuses)[number];

export const inventoryModes = [
  "FULL_COUNT",
  "SELECTIVE",
  "CYCLE_COUNT",
] as const;

export type InventoryMode = (typeof inventoryModes)[number];

export const campaignFieldDataTypes = [
  "TEXT",
  "NUMBER",
  "DATE",
  "BOOLEAN",
  "SELECT",
] as const;

export type CampaignFieldDataType = (typeof campaignFieldDataTypes)[number];

export const reconciliationCriterionCodes = [
  "LOCATION",
  "RESPONSIBLE",
  "PHYSICAL_CONDITION",
  "COST_CENTER",
  "SERIAL_NUMBER",
] as const;

export type ReconciliationCriterionCode =
  (typeof reconciliationCriterionCodes)[number];

export const reconciliationStatuses = [
  "PENDING",
  "CONCILIATED",
  "CONCILIATED_WITH_DIFFERENCES",
  "NOT_FOUND",
  "SURPLUS",
] as const;

export type ReconciliationStatus = (typeof reconciliationStatuses)[number];

export const evidenceStatuses = [
  "UPLOADED_PENDING_SCAN",
  "AVAILABLE",
  "QUARANTINED",
  "REJECTED",
] as const;

export type EvidenceStatus = (typeof evidenceStatuses)[number];

export const jobStatuses = [
  "QUEUED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
] as const;

export type JobStatus = (typeof jobStatuses)[number];

export const importJobKinds = ["ASSET_MASTER"] as const;

export type ImportJobKind = (typeof importJobKinds)[number];

export const exportJobKinds = ["EXCEL", "PDF", "EVIDENCE_ZIP"] as const;

export type ExportJobKind = (typeof exportJobKinds)[number];

export const assignmentStatuses = ["PENDING", "ACCEPTED", "COMPLETED"] as const;

export type AssignmentStatus = (typeof assignmentStatuses)[number];

export const findingSeverities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export type FindingSeverity = (typeof findingSeverities)[number];

export const findingStatuses = [
  "OPEN",
  "IN_REVIEW",
  "RESOLVED",
  "DISMISSED",
] as const;

export type FindingStatus = (typeof findingStatuses)[number];

export const timelineEventTypes = [
  "CAMPAIGN_CREATED",
  "CAMPAIGN_ACTIVATED",
  "CAMPAIGN_CLOSED",
  "SETTINGS_UPDATED",
  "ASSET_IMPORTED",
  "CAPTURE_CREATED",
  "RECONCILIATION_RECALCULATED",
  "EXPORT_REQUESTED",
] as const;

export type TimelineEventType = (typeof timelineEventTypes)[number];
