# Liraz Bar – לירז בר : infos à lui demander

Tout ce qui est marqué « à remplir » sur le site. Chaque info va dans un fichier précis (indiqué entre parenthèses) ; tant qu'un champ vaut `null`, il n'est pas affiché.

## Ce qu'on a trouvé sur son Instagram (@lirazbar02, relu le 10 novembre 2026)

- Bio : « 052-4378-733 – זוג הפקות אירועים · ארגון והפקות אירועים · חתונות – בר/בת מצווה – עיצוב אירועים · אטרקציות לאירועים », lien Facebook `m.facebook.com/zoogmusic`.
- 1 084 abonnés, 847 publications. Plus ancienne publication d'événement retrouvée : 2019.
- Elle travaille sous la marque **« זוג הפקות אירועים » (ZOOG)** avec **DJ Kobi Bar** (@djkobi_bar, @zoog_event_productions).
- Événements cités dans ses légendes : bar-mitsva d'Osher (famille Mishayev, 2026), bat-mitsva d'Oriya (2026), bar-mitsva de Roman, gala de l'école LFA (2025), lancement Select Car à **Akko** (2026), bat-mitsva de Peleg (famille Azoulay, 2025), Leann, Gaïa, Eliav, Daniel (famille Padida ?), Elad, Amit, Noa, Shay ; soirée Full Moon, fête de naissance.
- Prestations visibles : bars sucrés de luxe, lettres géantes (sequins, bois lumineux, fleurs), murs photo, sphères miroir, arches et ballons, danseuses, artistes LED et « מייצגים », fumée lourde, étincelles froides, confettis, DJ.
- Indices de région : Akko, « סטודיו צפון », livraisons « בצפון » → **Nord d'Israël, à confirmer**.
- Aucun prix, aucun avis public trouvé, aucun mariage clairement identifié comme produit par elle.

## À lui demander

1. **Son histoire et son parcours** : depuis quand, comment elle a commencé, son lien avec Kobi Bar (le site dit qu'ils travaillent ensemble ; à confirmer), ce qui la distingue. (`locales/*.json` → `about`)
2. **La marque à mettre en avant** : « לירז בר » seule, ou « זוג הפקות אירועים / ZOOG » ? Le site est au nom de Liraz Bar et cite ZOOG dans « Qui suis-je ».
3. **Les types d'événements et prestations exactes** : fait-elle vraiment des mariages en production complète ? Des fiançailles, des hennés, des événements d'entreprise ? (`locales/*.json` → `types`, `services`)
4. **Les prix « à partir de »**, si elle veut les afficher : production complète, coordination le jour J, décoration, gestion des prestataires. (`data/prestations.json` → `priceFrom`)
5. **Les régions couvertes** (aujourd'hui : « Nord d'Israël, et partout sur demande », à confirmer). (`data/infos.json`)
6. **Les salles et lieux** de chaque événement de la grille, et **le nombre d'invités**. (`data/realisations.json` → `place`, `guests`)
7. **Le nombre d'événements réalisés** (remplace le nombre d'abonnés à côté des boutons). (`data/stats.json` → `events`)
8. **De vrais avis clients** : nom, date, texte, source (Google, Facebook, WhatsApp avec accord). Aucun avis n'a été inventé. (`data/avis.json`)
9. **Photos et vidéos en bonne qualité** : les photos actuelles viennent d'Instagram (640 à 1 920 px). Surtout : **des mariages qu'elle a produits**, **un vrai portrait d'elle** (la photo du « Qui suis-je » la montre de profil en train de dresser un bar sucré, à confirmer que c'est bien elle), et des vidéos de ses reels récents. (dossier `assets/a-recevoir/`)
10. **Le logo**, si elle en a un (sinon on garde le logo typographique avec le ruban doré). (`components/Logo.tsx`, `app/icon.svg`)
11. **Le deuxième numéro** vu dans ses légendes (052-319-0259) : est-ce celui de Kobi ? Faut-il l'afficher ?
12. **Le bandeau « תאריכים לעונת 2027 פתוחים להזמנה »** : à garder ou à changer ? (`data/annonces.json`)
13. **L'acompte** : montant et moyen de paiement si elle veut un paiement en ligne (prévu dans le code, désactivé). (`lib/payment.ts`)
14. **Les dates déjà prises**, pour que le formulaire indique si une date est libre. (`data/dates.json`)
15. **Mentions légales** : nom de l'entreprise, numéro d'עוסק, adresse.
