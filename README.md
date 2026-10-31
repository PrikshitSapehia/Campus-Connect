# Campus Connect — Ready-to-run version

1. Open this folder in VS Code.
2. Make sure Firebase Authentication > Email/Password is enabled.
3. Make sure Firestore exists and the rules in `firestore.rules` are published.
4. Install the VS Code Live Server extension.
5. Right-click `index.html` → Open with Live Server.

The Firebase web configuration is already filled in for the project supplied during setup.

For security, admin authorization should ultimately use trusted Firebase custom claims/server-side administration rather than a client-editable role field. This version keeps the UI and basic project flow simple for development.
