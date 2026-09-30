# OrgConnect Interactive Walkthrough

This project combines the OrgConnect mobile and desktop prototypes into one Vite/React walkthrough.

## Run locally

1. Open this folder in VS Code.
2. Open a terminal in the folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL Vite prints in the terminal.

## Build for GitHub Pages

Run:

```bash
npm run build
```

The production files will be created in `dist/`. The Vite config uses a relative base (`./`) so the build can be hosted from a GitHub Pages project path.

## Prototype behavior

- Use the **Mobile app** / **Desktop / Web** switch in the walkthrough.
- The device content is React UI, not a screenshot.
- Mobile and desktop keep their own navigation and interactions.

## Registration and verification flows

The Organization and Local Business POVs now include responsive Registration & Verification screens for mobile and desktop.

- Email ownership is verified through a one-time verification link.
- Organizations may upload a recognition letter, organization ID, or adviser endorsement.
- Local businesses may upload a business permit, Mayor's permit, or DTI/SEC registration.
- Applicants must accept the Privacy Notice and confirm that the submitted information is accurate.
- The interface explains that documents are used only for validation, are not publicly displayed, and are handled under the Philippine Data Privacy Act of 2012 (RA 10173).
- The prototype shows a 1–3 business day review period and email notification of the decision.

This is a front-end prototype. Production implementation should use authenticated accounts, server-side file validation, malware scanning, encryption in transit and at rest, role-based reviewer access, audit logs, a documented retention/deletion schedule, and a working privacy-request channel.


## Corrected login and registration
Organization and Business mobile and desktop begin at Login. Choose Sign up for Email → Details → Documents → Privacy consent → demo dashboard. Details require all fields and an 11-digit 09 mobile number. Files accept PDF/JPG/PNG up to 10 MB. Authentication and verification are simulated; no emails or documents are sent. Use Try demo account or a valid email and non-empty password. Live public listings would require reviewer approval.


## Click-through demo mode
Login and all registration steps are optional to fill. Click Log in with blank fields, or Sign up → Next → Next → Next → Proceed to dashboard. Email, details, document upload and privacy consent remain visible for demonstration without blocking navigation in either POV or device mode.
