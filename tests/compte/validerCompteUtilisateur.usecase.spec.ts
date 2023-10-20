import { ValiderCompteUtilisateurUsecase } from '@/compte/validerCompteUtilisateur.usecase';
import { SessionRepository } from '@/authentification/authentifierUtilisateur.usecase';
import { Utilisateur, UtilisateurRepository } from '@/authentification/ports/utilisateur.repository';

class SpySessionRepository implements SessionRepository {
  get utilisateur(): Utilisateur {
    return this._utilisateur;
  }

  private _utilisateur: Utilisateur = { id: '', nom: '', codePostal: '', prenom: '', mail: '', revenuFiscal: '' };

  sauvegarderUtilisateur(utilisateur: Utilisateur) {
    this._utilisateur = utilisateur;
  }
}

class SpyValiderCompteUtilisateurRepository implements UtilisateurRepository {
  authentifierUtilisateur(email: string, motDePasse: string): Promise<Utilisateur> {
    throw Error();
  }

  getUtilisateurAvecId(idUtilisateur: string): Promise<Utilisateur> {
    throw Error();
  }

  validerCompteUtilisateur(email: string, code: string): Promise<Utilisateur> {
    return Promise.resolve({
      id: '',
      nom: '',
      codePostal: '',
      prenom: '',
      mail: email,
      revenuFiscal: '',
    });
  }
}
describe('Fichier de tests concernant la validation du compte utilisateur', () => {
  it('En donnant un mail et un code doit valider le compte', async () => {
    // GIVEN
    // WHEN
    const spySessionRepository = new SpySessionRepository();
    const usecase = new ValiderCompteUtilisateurUsecase(
      new SpyValiderCompteUtilisateurRepository(),
      spySessionRepository
    );
    await usecase.execute('john@exemple.com', '123456');
    // THEN
    expect(spySessionRepository.utilisateur).toEqual({
      id: '',
      nom: '',
      codePostal: '',
      prenom: '',
      mail: 'john@exemple.com',
      revenuFiscal: '',
    });
  });
});