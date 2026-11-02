# Travel Journal

A static travel journal published with GitHub Pages. The entry page asks for a shared four-digit PIN. The journal HTML, styles, map data and scripts are encrypted together; plaintext itinerary files and the PIN are not included in this repository.

The payload uses AES-256-GCM with a random salt and IV, and a PBKDF2-SHA256 derived key. Decryption runs in the browser over HTTPS. Reloading the page or using the journal's lock button returns to the PIN screen. The PIN is not saved in browser storage.

A four-digit shared PIN has low entropy and can be guessed offline. This is a convenience sharing gate, not a high-assurance authentication system or a substitute for account-based access control. Do not use it for highly sensitive records.

## Deployment

Publish the root of the `main` branch with GitHub Pages. Keep `.nojekyll`, `index.html`, `gate.css`, `gate.js` and `trip.enc.json` together. Update the payload by rebuilding from the owner's local source with a fresh salt and IV. Never commit plaintext source, original travel documents or a PIN to this repository.

## Map attribution

The unlocked journal includes Leaflet 1.9.4 (license in `LEAFLET-LICENSE.txt`). Map tiles are provided by OpenStreetMap and retain visible attribution. Tiles load only after the journal is unlocked. Links to external map and navigation services open on request.
