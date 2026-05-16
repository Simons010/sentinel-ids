
## 2024-05-16 - [Fix missing authentication on LogIngestView]
**Vulnerability:** The machine-to-machine API endpoint `LogIngestView` was configured with `permission_classes = [AllowAny]`, allowing unauthenticated log ingestion.
**Learning:** Default permissions in Django (`IsAuthenticated`) often prompt developers to use `AllowAny` for API integrations because normal user tokens don't apply. This creates a critical vulnerability for machine-to-machine endpoints. We need explicit API key permissions.
**Prevention:** For any machine-to-machine or external integration endpoint, always implement and apply explicit permission classes like `HasAPIKey` that validate against API keys, rather than falling back to `AllowAny`.
