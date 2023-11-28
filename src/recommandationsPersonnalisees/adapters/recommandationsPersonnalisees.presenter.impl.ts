import { RecommandationPersonnalisee } from '@/recommandationsPersonnalisees/recommandationsPersonnalisees.usecase';
import { InteractionType } from '@/shell/interactionType';
import { RecommandationsPersonnaliseesPresenter } from '@/recommandationsPersonnalisees/ports/recommandationsPersonnalisees.presenter';

export interface RecommandationViewModel {
  id: string;
  titre: string;
  image: string;
  description: string;
  url: string;
  contentId: string;
  nombreDePointsAGagner: string;
  type: string;
  thematique: string;
}
export interface RecommandationPersonnaliseeViewModel {
  recommandationHighlight: RecommandationViewModel;
  recommandationsList: RecommandationViewModel[];
}

export class RecommandationsPersonnaliseesPresenterImpl implements RecommandationsPersonnaliseesPresenter {
  constructor(
    private viewModel: (recommandationPersonnaliseeViewModels: RecommandationPersonnaliseeViewModel) => void
  ) {}
  presente(recommandationsPersonnalisees: RecommandationPersonnalisee[]): void {
    const recommandationHighlight = recommandationsPersonnalisees.find(
      recommandationPersonnalisee => recommandationPersonnalisee.type === InteractionType.ARTICLE
    );

    if (recommandationHighlight) {
      this.viewModel({
        recommandationHighlight: {
          id: recommandationHighlight.id,
          titre: recommandationHighlight.titre,
          image: recommandationHighlight.illustrationURL,
          description: recommandationHighlight.sousTitre,
          url: this.determineUrl(recommandationHighlight),
          contentId: recommandationHighlight.idDuContenu,
          nombreDePointsAGagner: recommandationHighlight.nombreDePointsAGagner,
          type: recommandationHighlight.type,
          thematique: recommandationHighlight.categorie,
        },
        recommandationsList: recommandationsPersonnalisees
          .filter(reco => reco.id !== recommandationHighlight.id)
          .map(recommandationPersonnalisee => {
            return {
              id: recommandationPersonnalisee.id,
              thematique: recommandationPersonnalisee.categorie,
              titre: recommandationPersonnalisee.titre,
              image: recommandationPersonnalisee.illustrationURL,
              url: this.determineUrl(recommandationPersonnalisee),
              contentId: recommandationPersonnalisee.idDuContenu,
              nombreDePointsAGagner: recommandationPersonnalisee.nombreDePointsAGagner,
              type: recommandationPersonnalisee.type,
              description: recommandationPersonnalisee.sousTitre,
            };
          })
          .slice(0, 3),
      });
    }
  }

  private determineUrl(recommandationPersonnalisee: RecommandationPersonnalisee) {
    switch (recommandationPersonnalisee.type) {
      case InteractionType.AIDE:
        return '/vos-aides';
      case InteractionType.QUIZ:
        return `/coach/quiz/${recommandationPersonnalisee.idDuContenu}`;
      case InteractionType.ARTICLE:
        return `/article/${recommandationPersonnalisee.titre}`;
      case InteractionType.KYC:
        return '';
      case InteractionType.SUIVIDUJOUR:
        return '/coach/suivi-du-jour';
    }
  }
}