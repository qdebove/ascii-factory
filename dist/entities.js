// Factory entities and map configuration.
export const WIDTH=40,HEIGHT=24,STEP=.25,OFFLINE_CAP=8*3600;
export const DIRS=[[1,0],[0,1],[-1,0],[0,-1]],ARROWS=['→','↓','←','↑'];
export const DEPOSITS=[{x:3,y:4,t:'gold'},{x:3,y:8,t:'dust'},{x:3,y:11,t:'dust'},{x:19,y:4,t:'gold'},{x:19,y:12,t:'dust'},{x:34,y:5,t:'gold'},{x:34,y:16,t:'dust'},{x:20,y:20,t:'dust'}];
const definitions=[
 ['gold',"Foreuse d’or",'◆','production',0,100,4,'#ecc174','Extrait 8 pièces toutes les 4 secondes. À placer sur ◆.'],
 ['dust','Extracteur','░','production',0,80,.5,'#b8d38f','Une poussière toutes les 0,5 s. À placer sur ░.'],
 ['belt','Convoyeur','»','logistics',0,5,.5,'#87a783','Transporte un produit à la fois. La flèche indique la sortie.'],
 ['chest','Coffre','▤','logistics',0,70,1,'#e3bc7c','Stocke 80 produits. Vente automatique disponible pour libérer la chaîne.'],
 ['letter','Presse à lettres','[a]','production',1,140,1,'#d2f583','3 poussières → 1 lettre. Voyelles, consonnes ou toutes les lettres.'],
 ['word','Assembleur','abc','production',2,200,2,'#c2a3e9','Assemble des lettres physiques. Mode brut, puis recettes des mots découverts après la recherche Recettes mémorisées.'],
 ['shuffle','Mélangeur','⇄','language',2,120,1,'#c2a3e9','Mélange les lettres ; la validité du mot est recalculée.'],
 ['accent','Accentueur','é','language',2,100,1,'#c2a3e9','Accentue la première voyelle compatible. Le mot est ensuite revérifié.'],
 ['scanner','Lexicographe','[?]','language',3,150,1,'#9acfd1','Reconnaît les mots du dictionnaire. Mots bruts vers le port orange de rejet.'],
 ['filter','Filtre','Y','logistics',3,90,.5,'#8fbbb2','Correspondances en face ; autres produits à droite de la sortie principale.'],
 ['buffer','Tampon','[=]','logistics',3,100,.5,'#8fbbb2','Réserve de 48 produits, avec sortie automatique.'],
 ['recycler','Recycleur','%','production',3,100,1,'#9ebd8b','1 produit → 1 poussière. Récupère les surplus ; rendement volontairement limité.'],
 ['phrase','Composeur','a b','language',4,300,3,'#d6aceb','Réunit des mots valides ou des phrases. Réglez le nombre minimal de mots.'],
 ['space','Espaceur','␣','language',4,100,1,'#d6aceb','Insère un espace entre chaque mot d’un groupe.'],
 ['upper','Majuscule','aA','language',4,100,1,'#d6aceb','Met en majuscule la première lettre ; conserve la suite du texte.'],
 ['punct','Ponctuation','!?','language',4,120,1,'#d6aceb','Ajoute une ponctuation finale. Une phrase valide finit par . ! ou ?'],
 ['validator','Validateur','✓','language',4,180,1,'#d2f583','Vérifie dictionnaire, espaces, majuscule et fin de phrase. Rejets par le port orange.'],
 ['vault','Archives','[T]','language',4,250,1,'#efca79','Archive les phrases validées, enregistre les records et permet leur vente.'],
 ['splitter','Répartiteur','↗','logistics',5,80,.5,'#8fbbb2','Alterne entre la sortie principale et la sortie droite disponible.'],
 ['merger','Fusionneur','>1','logistics',5,80,.5,'#8fbbb2','Réunit trois entrées dédiées vers une sortie. Les arrivées sont arbitrées à tour de rôle.'],
 ['priority','Priorité','1>','logistics',5,120,.5,'#8fbbb2','Envoie en face. Utilise la droite uniquement si la sortie principale bloque.'],
 ['overflow','Trop-plein','>>','logistics',5,100,.5,'#8fbbb2','Dirige le surplus à droite si la voie principale est indisponible.'],
 ['fastbelt','Convoyeur rapide','≫','logistics',5,15,.25,'#b6ddd0','Deux fois le débit d’un convoyeur normal.']
];
export const TYPES=Object.fromEntries(definitions.map(([id,name,icon,category,tier,cost,period,color,desc])=>[id,{id,name,icon,category,tier,cost,period,color,desc}]));
