const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'js', 'modules');
const files = fs.readdirSync(dir).filter((file) => file.endsWith('.js'));

function mojibakeScore(text) {
  return (text.match(/[ÃÂâÅð�]/g) || []).length;
}

function decodeLatin1Utf8(text) {
  return Buffer.from(text, 'latin1').toString('utf8');
}

function repairMojibake(text) {
  let current = text;

  for (let i = 0; i < 3; i += 1) {
    const decoded = decodeLatin1Utf8(current);
    if (mojibakeScore(decoded) < mojibakeScore(current)) {
      current = decoded;
      continue;
    }
    break;
  }

  return current;
}

const replacements = [
  ['ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â', ' - '],
  ['Ã¢â‚¬â€', ' - '],
  ['ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢', '&rarr;'],
  ['Ã¢â€ â€™', '&rarr;'],
  ['ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Å“', '&darr;'],
  ['Ã¢â€ â€œ', '&darr;'],
  ['ÃƒÂ¢Ã¢â‚¬Â Ã‚Â', '&larr;'],
  ['Ã¢â€ Â', '&larr;'],
  ['ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Â', '&harr;'],
  ['Ã¢â€ â€', '&harr;'],
  ['ÃƒÂ¢Ã¢â‚¬Â¡Ã¢â‚¬Å¾', '&hArr;'],
  ['Ã¢â€¡â€ž', '&hArr;'],
  ['ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“', '&check;'],
  ['Ã¢Å“â€œ', '&check;'],
  ['ÃƒÂ¢Ã…â€œÃ¢â‚¬â€', '&times;'],
  ['Ã¢Å“â€”', '&times;'],
  ['ÃƒÂ¢Ã‹â€ Ã¢â‚¬â„¢', '-'],
  ['Ã¢Ë†â€™', '-'],
  ['Ãƒâ€šÃ‚Â·', '&middot;'],
  ['Ã‚Â·', '&middot;'],
  ['ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦', '...'],
  ['Ã¢â‚¬Â¦', '...'],
  ['ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹', 'Rs. '],
  ['properties Ã‚Â· methods Ã‚Â· lifecycle', 'properties &middot; methods &middot; lifecycle'],
  ['{{ bindings }} Ã‚Â· *directives', '{{ bindings }} &middot; *directives'],
  ['scoped Ã‚Â· no leakage', 'scoped &middot; no leakage'],
  ['ÃƒÂ¯Ã‚Â¸Ã‚ÂÃƒÂ¢Ã†â€™Ã‚Â£', ''],
  ['ÃƒÂ°Ã…Â¸Ã‚ÂÃ…â€™ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦', ''],
  ['→', '&rarr;'],
  ['←', '&larr;'],
  ['↓', '&darr;'],
  ['↔', '&harr;'],
  ['⇔', '&hArr;'],
  ['✓', '&check;'],
  ['✔', '&check;'],
  ['✗', '&times;'],
  ['✘', '&times;'],
  ['âœ…', '&check;'],
  ['âŒ', '&times;'],
  ['•', '&middot;'],
  ['·', '&middot;'],
  ['₹', 'Rs. '],
  ['â‚¹', 'Rs. '],
  ['1ï¸âƒ£', '1.'],
  ['2ï¸âƒ£', '2.'],
  ['3ï¸âƒ£', '3.'],
  ['4ï¸âƒ£', '4.'],
  ['â‘ ', '1.'],
  ['â‘¡', '2.'],
  ['â‘¢', '3.'],
  ['â‘£', '4.'],
  ['â‘¤', '5.'],
  ['â‘¥', '6.'],
  ['â”€', '-'],
  ['â”‚', '|'],
  ['â”œ', '|'],
  ['â”¤', '|'],
  ['â””', '|'],
  ['â”˜', '|'],
  ['🍌📦', ''],
  ['ðŸŒðŸ“¦', ''],
];

const iconMap = {
  '01-core-concepts.js': 'bi bi-building',
  '02-data-binding.js': 'bi bi-link-45deg',
  '03-directives.js': 'bi bi-grid-3x3-gap',
  '04-services-di.js': 'bi bi-tools',
  '05-component-communication.js': 'bi bi-chat-dots',
  '06-lifecycle-hooks.js': 'bi bi-hourglass-split',
  '07-routing.js': 'bi bi-signpost-split',
  '08-forms.js': 'bi bi-ui-checks-grid',
  '09-pipes.js': 'bi bi-funnel',
  '10-observables-rxjs.js': 'bi bi-broadcast',
  '11-http-api.js': 'bi bi-cloud-arrow-down',
  '12-change-detection.js': 'bi bi-lightning-charge',
  '13-state-management.js': 'bi bi-diagram-3',
  '14-performance-optimization.js': 'bi bi-speedometer2',
  '15-testing.js': 'bi bi-check2-circle',
  '16-advanced-concepts.js': 'bi bi-rocket-takeoff',
  '17-security.js': 'bi bi-shield-lock',
  '18-build-deployment.js': 'bi bi-box-seam',
  '19-animations.js': 'bi bi-magic',
  '20-i18n.js': 'bi bi-translate',
  '21-accessibility.js': 'bi bi-universal-access',
  '22-pwa.js': 'bi bi-phone-vibrate',
  '23-signals.js': 'bi bi-reception-4',
  '24-standalone-components.js': 'bi bi-box',
  '25-template-syntax.js': 'bi bi-code-slash',
  '26-ngzone.js': 'bi bi-speedometer',
  '27-web-workers.js': 'bi bi-cpu',
  '28-angular-material.js': 'bi bi-palette',
  '29-error-handling.js': 'bi bi-bug',
  '30-deployment-devops.js': 'bi bi-cloud-upload',
  '31-typescript-related.js': 'bi bi-filetype-ts',
  '32-micro-frontends.js': 'bi bi-puzzle',
  '33-memory-management.js': 'bi bi-layers',
  '34-workspace-projects.js': 'bi bi-folder2-open',
  '35-custom-elements.js': 'bi bi-puzzle-fill',
  '36-ssr-hydration.js': 'bi bi-server',
  '37-version-specific-features.js': 'bi bi-arrow-repeat',
  '38-real-world-scenarios.js': 'bi bi-globe',
};

for (const file of files) {
  const full = path.join(dir, file);
  let text = repairMojibake(fs.readFileSync(full, 'utf8'));

  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }

  if (iconMap[file]) {
    text = text.replace(/"icon":\s*"[^"]*"/, `"icon": "${iconMap[file]}"`);
  }

  fs.writeFileSync(full, text, 'utf8');
}

console.log(`Updated ${files.length} module files.`);
