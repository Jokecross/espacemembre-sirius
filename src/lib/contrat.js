/* Le contrat de garantie « Premier client en 7 jours ». Même texte que le
   PDF remis aux setters (~/Desktop/Contrat-Garantie-7-jours-Sirius.pdf) et
   que l'article 7 des conditions de vente. Une modification ici doit aussi
   y être reportée. */

export const EDITEUR =
  "Sirius Circle Project Management Services, établissement individuel immatriculé à Dubaï, Émirats arabes unis (licence n° 1540363, registre du commerce n° 2676473), représenté par Anthony Sirius, ci-après « Sirius »"

export const ARTICLES = [
  ['Objet', "Le Client rejoint le programme d'Anthony Sirius à la date d'entrée indiquée ci-dessus. Ce contrat définit la garantie « Premier client en 7 jours »."],
  ['La garantie', "Si, 7 jours après sa date d'entrée, le Client n'a pas signé son premier client, Sirius lui rembourse les 9,99 € payés pour réserver son appel."],
  ['Le premier client', 'Une personne ou une entreprise qui a accepté, par écrit ou par paiement, de payer le Client pour une prestation.'],
  ['La demande', "Le Client fait sa demande au plus tard 30 jours après sa date d'entrée, auprès de la personne de l'équipe qui l'a appelé ou par message privé à Anthony Sirius sur Skool, avec l'e-mail utilisé pour le paiement. Une seule garantie par personne."],
  ['Le remboursement', 'Il est fait par Whop, sur le moyen de paiement utilisé, dans les 14 jours qui suivent la demande.'],
  ['Les limites', "La garantie porte uniquement sur les 9,99 € de la réservation. Elle ne couvre ni l'abonnement, ni les contenus, ni le coaching. Pour le reste, les conditions générales de vente de Sirius s'appliquent (iamoneyclub-starter.com/legal)."],
]

export const lienContrat = (token) => `${window.location.origin}/contrat/${token}`
