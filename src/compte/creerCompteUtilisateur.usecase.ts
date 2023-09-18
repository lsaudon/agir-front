import { CompteUtilisateurRepository } from "@/compte/ports/compteUtilisateur.repository";
import { CompteUtlisateurViewModel } from "@/compte/adapters/compteUtilisateur.presenter.impl";
import { SessionRepository } from "@/authentification/authentifierUtilisateur.usecase";

export class CreerCompteUtilisateurUsecase {
  private _compteUtilisateuRepository: CompteUtilisateurRepository;
  private _sessionRepository: SessionRepository;

  constructor(compteUtilisateuRepository: CompteUtilisateurRepository, sessionRepository: SessionRepository) {
    this._compteUtilisateuRepository = compteUtilisateuRepository;
    this._sessionRepository = sessionRepository;
  }

  async execute(compteUtlisateurACreerViewModel: CompteUtlisateurViewModel): Promise<void> {
    const utilisateurCree = await this._compteUtilisateuRepository.creerCompteUtilisateur(
      compteUtlisateurACreerViewModel.nom,
      compteUtlisateurACreerViewModel.mail
    );
    this._sessionRepository.sauvegarderUtilisateur({
      nom: utilisateurCree.nom,
      id: utilisateurCree.id,
    });
  }
}