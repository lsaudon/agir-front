import {
  ChauffageLogementApiModel,
  DPELogementApiModel,
  SuperficieLogementApiModel,
  TypeLogementApiModel,
} from '@/logement/adapters/logement.repository.axios';
import { Logement } from '@/logement/recupererInformationLogement.usecase';
import { LogementRepositorySpy } from './adapters/logement.repository.spy';
import { EnregistrerInformationsLogementUsecase } from '@/logement/enregistrerInformationLogement.usecase';

describe("Fichier de tests concernant l'enregistrement des informations du logement", () => {
  it('Doit envoyer les informations au back-end', () => {
    // GIVEN
    const logement: Logement = {
      adultes: 0,
      enfants: 0,
      codePostal: '75001',
      commune: 'PARIS 01',
      residence: TypeLogementApiModel.Appartement,
      superficie: SuperficieLogementApiModel.Superficie_150_Et_Plus,
      proprietaire: 'oui',
      modeDeChauffage: ChauffageLogementApiModel.Bois,
      plusDeQuinzeAns: 'non',
      dpe: DPELogementApiModel.B,
    };
    const spyLogementRepository = new LogementRepositorySpy();

    // WHEN
    const usecase = new EnregistrerInformationsLogementUsecase(spyLogementRepository);
    usecase.execute('idUtilsateur', logement);

    // THEN
    expect(spyLogementRepository.enregistrerLesInformationsAEteAppele).toBeTruthy();
    expect(spyLogementRepository.enregistrerLesInformationsArgs).toStrictEqual<Logement>({
      adultes: 0,
      enfants: 0,
      codePostal: '75001',
      commune: 'PARIS 01',
      residence: TypeLogementApiModel.Appartement,
      superficie: SuperficieLogementApiModel.Superficie_150_Et_Plus,
      proprietaire: 'oui',
      modeDeChauffage: ChauffageLogementApiModel.Bois,
      plusDeQuinzeAns: 'non',
      dpe: DPELogementApiModel.B,
    });
  });
});