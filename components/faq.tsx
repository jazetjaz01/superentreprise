import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
  {
    question: "Combien coûte la diffusion d'une annonce ?",
    answer:
      "L'abonnement solo (1 annonce) coûte 30 € TTC par mois, sans engagement. Les agences et professionnels peuvent souscrire à un forfait pro (5, 10 ou 25 annonces) à partir de 49 € HT par mois.",
  },
  {
    question: "Puis-je résilier mon abonnement à tout moment ?",
    answer:
      "Oui, vous pouvez résilier sans préavis ni justification depuis votre espace Mon abonnement. Votre annonce reste diffusée jusqu'à la fin de la période déjà payée, puis est automatiquement dépubliée.",
  },
  {
    question: "Combien de photos puis-je ajouter à mon annonce ?",
    answer:
      "Jusqu'à 5 photos par annonce. Vous pouvez importer vos propres images ou choisir parmi notre bibliothèque de photos par défaut selon votre activité ou votre ville.",
  },
  {
    question: "Comment fonctionne la messagerie avec les acheteurs ?",
    answer:
      "Une messagerie interne vous permet d'échanger directement avec les acheteurs intéressés par votre annonce. Un profil identifié (nom, prénom ou surnom) est requis pour envoyer un message.",
  },
  {
    question: "Puis-je rester anonyme auprès des autres utilisateurs ?",
    answer:
      "Oui, vous pouvez renseigner un surnom dans votre profil : il sera affiché à la place de votre nom et prénom auprès des autres utilisateurs, si vous le souhaitez.",
  },
  {
    question: "Quelle est la différence entre l'abonnement solo et les forfaits pro ?",
    answer:
      "L'abonnement solo permet de diffuser une seule annonce. Les forfaits pro (Découverte, Professionnel, Expert) sont pensés pour les agences et permettent de diffuser plusieurs annonces simultanément.",
  },
  {
    question: "Pourquoi dois-je compléter mon profil société ?",
    answer:
      "Les informations de votre société (nom, adresse, SIRET, TVA) sont nécessaires pour émettre les factures liées à votre abonnement, conformément aux obligations légales.",
  },
  {
    question: "Mon annonce n'est pas visible, pourquoi ?",
    answer:
      "Une annonce doit être complète (informations, prix, ville, au moins une photo) et votre abonnement doit être actif pour être publiée. Vérifiez le statut de votre annonce dans Mes annonces.",
  },
  {
    question: "Puis-je modifier mon annonce après sa publication ?",
    answer:
      "Oui, vous pouvez modifier le contenu de votre annonce à tout moment depuis Mes annonces, y compris après sa publication.",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Vous pouvez nous écrire à contact@superentreprise.com ou utiliser le formulaire de la page Contact.",
  },
];

const FAQ = () => {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto w-full max-w-(--breakpoint-lg)">
        <h2 className="font-medium text-4xl tracking-[-0.04em] md:text-[2.75rem]">
          Questions fréquentes
        </h2>

        <div className="mt-6 grid w-full gap-x-10 md:grid-cols-2">
          <Accordion className="w-full">
            {faq.slice(0, 5).map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`question-${index}`}>
                <AccordionTrigger className="text-lg">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion className="w-full">
            {faq.slice(5).map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`question-${index + 5}`}>
                <AccordionTrigger className="text-lg">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
