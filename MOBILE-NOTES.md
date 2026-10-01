# Interface mobile-first — 30 septembre 2026

- Base responsive mobile, enrichie à 600 px puis bureau à 1100 px. Les anciennes surcharges contradictoires sont retirées.
- Terrain en hauteur flexible ; zones sûres du téléphone et hauteur dynamique de la fenêtre prises en compte ; adaptation paysage dédiée.
- Bandeau de ressources avec libellés, accès au record et menu ; navigation basse : Bâtir, Machine, Labo, Objectifs, Stats.
- La sélection garde la carte visible. Les actions contextuelles proposent Régler, Tourner, Déplacer, Démolir et Fermer. La carte dispose toujours de centrage et zoom.
- Construction et déplacement mobiles en deux temps : choix de la case, aperçu puis confirmation. Case invalide signalée en rouge et validation désactivée. Le déplacement conserve le stock ; la rotation est appliquée à la confirmation. Sur ordinateur, le placement direct est conservé.
- Catalogue en cartes ; panneaux à en-tête fixe et contenu défilant ; agrandissement et fermeture accessibles ; focus et attributs d’expansion synchronisés. Modales adaptées aux petits écrans ; champs de 16 px et commandes principales d’au moins 44 px.
- Guide masqué pendant le choix de placement, puis étape suivante après confirmation. Sauvegardes et simulation inchangées.

Validation : 28 tests automatisés, dont quatre parcours d’interface avec DOM simulé ; construction sans dépense avant confirmation, sélection sans ouverture forcée, réglages, déplacement avec stock et rotation, placement ordinateur et ouverture des principales fenêtres. Tests Canvas/pointer aux dimensions 320×568, 360×800, 390×844, 412×915, 768×1024, 844×390 et 1024×768. Structure HTML et unicité des identifiants contrôlées.

Limite : pas de rendu navigateur réel. Le skill control-browser est indisponible et ce site statique n’a pas de serveur compatible avec l’aperçu supervisé. Les tests utilisent un DOM/Canvas simulé ; ils ne prouvent pas l’absence de débordements visuels sur un appareil réel. Une validation sur téléphone et tablette reste à réaliser.
