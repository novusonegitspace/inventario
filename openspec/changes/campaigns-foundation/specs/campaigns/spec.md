# Delta for Campaigns

## ADDED Requirements

### Requirement: Campaign Listing
The system SHALL provide a campaigns listing page scoped to the current product context.

#### Scenario: List visible campaigns
- GIVEN a user enters the campaigns area
- WHEN campaigns are available
- THEN the system shows a list of campaigns
- AND each campaign shows its name, status, client or site context, and summary metrics

#### Scenario: Empty campaigns state
- GIVEN no campaigns exist yet
- WHEN the user opens the campaigns listing page
- THEN the system shows an empty state
- AND the empty state offers a clear path to create the first campaign

### Requirement: Campaign Creation
The system SHALL allow creation of a campaign with the minimum data required to start the workflow.

#### Scenario: Create draft campaign
- GIVEN a user opens the new campaign flow
- WHEN the user submits valid campaign data
- THEN the system creates the campaign in `draft` status
- AND the system returns the user to a campaign destination with confirmation

#### Scenario: Reject invalid campaign input
- GIVEN a user is completing the new campaign form
- WHEN required data is missing or invalid
- THEN the system prevents submission
- AND the system displays validation feedback near the affected fields

### Requirement: Campaign Detail
The system SHALL provide a dedicated detail view for each campaign.

#### Scenario: Open campaign detail
- GIVEN a campaign exists
- WHEN a user selects that campaign from the listing
- THEN the system shows the campaign detail page
- AND the page includes its current status and core operational context

#### Scenario: Campaign not found
- GIVEN a user requests a campaign identifier that does not exist
- WHEN the detail page resolves the request
- THEN the system shows a not found state
- AND the response does not expose internal errors to the user

### Requirement: Campaign Lifecycle Foundation
The system SHALL model the initial campaign lifecycle using the states `draft`, `active`, and `closed`.

#### Scenario: New campaigns start as draft
- GIVEN a new campaign is created
- WHEN creation succeeds
- THEN the campaign state is `draft`

#### Scenario: Closed campaigns are non-operable
- GIVEN a campaign is in `closed` state
- WHEN the UI renders available actions
- THEN editing-oriented actions are disabled or hidden
- AND capture-oriented actions are disabled or hidden

### Requirement: Campaign Slice Architecture
The system SHALL implement `campaigns` as a dedicated domain slice, not as route-only UI code.

#### Scenario: Campaign domain is explicit in code structure
- GIVEN a developer inspects the codebase
- WHEN they review the campaigns implementation
- THEN they can identify domain, application, infrastructure, and UI responsibilities for the `campaigns` slice
- AND route files remain focused on composition rather than business rules
