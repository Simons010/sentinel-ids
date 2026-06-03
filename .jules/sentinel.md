## 2024-05-18 - [Fix missing authentication on log ingest endpoint]
**Vulnerability:** The automated log ingestion endpoint `LogIngestView` allowed unauthenticated access (`AllowAny`), meaning anyone could ingest malicious or fake logs into the system.
**Learning:** System configurations lacked a distinct permission class for machine-to-machine APIs. Broadly applying user session permissions would break API integrations, leading to a fallback to no authentication.
**Prevention:** Created a specific `HasAPIKey` permission class that validates an API key against the `IntegrationApiKey` model to securely authorize automated integrations without breaking user-facing views.
