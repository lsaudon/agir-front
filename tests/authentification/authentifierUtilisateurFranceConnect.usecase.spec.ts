import { SessionRepository } from "../../src/authentification/authentifierUtilisateur.usecase";
import { Utilisateur, UtilisateurRepository } from "../../src/authentification/ports/utilisateur.repository";
import { AuthentifierUtilisateurFranceConnectUsecase } from "../../src/authentification/authentifierUtilisateurFranceConnect.usecase";

class UtilisateurRepositoryForTest implements UtilisateurRepository {
  get idUtilisateur(): string {
    return this._idUtilisateur;
  }

  private _idUtilisateur: string = "";

  getUtilisateurAvecLeNom(nomUtilisateur: string): Promise<Utilisateur> {
    throw Error;
  }

  getUtilisateurAvecId(idUtilisateur: string): Promise<Utilisateur> {
    this._idUtilisateur = idUtilisateur;
    return Promise.resolve({
      id: "4df5cd01-ae3e-46fa-99d4-9c18f696b6ba",
      nom: "DUBOIS",
    });
  }
}

class SpySessionRepository implements SessionRepository {
  get utilisateur(): Utilisateur {
    return this._utilisateur;
  }

  private _utilisateur: Utilisateur = { id: "", nom: "" };

  sauvegarderUtilisateur(utilisateur: Utilisateur) {
    this._utilisateur = utilisateur;
  }
}

describe("Fichier de tests concernant l'authentification France Connect", () => {
  it("Lorsque je passe un token doit sauvegarder le nom et l'id", async () => {
    // GIVEN
    const spySessionRepository = new SpySessionRepository();
    const utilisateurRepositoryForTest = new UtilisateurRepositoryForTest();
    const usecase = new AuthentifierUtilisateurFranceConnectUsecase(utilisateurRepositoryForTest, spySessionRepository);
    // WHEN
    await usecase.execute(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1cklkIjoiNGRmNWNkMDEtYWUzZS00NmZhLTk5ZDQtOWMxOGY2OTZiNmJhIiwiaWF0IjoxNjkyMjU5MjI0LCJleHAiOjE2OTIyNTkyODR9.6Qm_REdedxvT5D8ppqtG7igcizs1OkbAD610kulRgWU"
    );
    // THEN
    expect(utilisateurRepositoryForTest.idUtilisateur).toStrictEqual("4df5cd01-ae3e-46fa-99d4-9c18f696b6ba");
    expect(spySessionRepository.utilisateur).toStrictEqual({
      id: "4df5cd01-ae3e-46fa-99d4-9c18f696b6ba",
      nom: "DUBOIS",
    });
  });
});