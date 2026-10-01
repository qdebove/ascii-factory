# ASCIIFactory

Jeu d’usine en ASCII : extraction, production de lettres, assemblage de mots et de phrases.

## Lancement local

Le dossier `dist/` contient directement les sources HTML, CSS et JavaScript, sans étape de compilation.

Avec Python installé, depuis la racine :

```sh
python -m http.server 8000 --directory dist
```

Sous Windows, remplacer `python` par `py` si nécessaire. Ouvrir http://localhost:8000.

## Tests

Avec Node.js 22 ou supérieur :

```sh
node --experimental-default-type=module --test tests/*.test.mjs
```

## Sources

Import de la version 2.6 depuis Sites, commit source `6524d40030366d1fc9716efa656582efde5228a9` (1 octobre 2026).

- `dist/` : interface et moteur du jeu.
- `tests/` : tests automatisés.
- `*-NOTES.md` : notes des évolutions.
- `.openai/hosting.json` : configuration du site Sites existant.

Les sauvegardes de parties restent dans le navigateur. Les exporter depuis le jeu avant de changer d’adresse ou de navigateur.

Cet import ne configure aucune synchronisation automatique entre GitHub et Sites.
