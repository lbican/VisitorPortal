import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.resolve(__dirname, '../locales/en/translation.json');
const translations = JSON.parse(fs.readFileSync(file, 'utf8'));

for (let key in translations) {
    if (translations[key] === '') {
        translations[key] = key;
    }
}

fs.writeFileSync(file, JSON.stringify(translations, null, 2));
