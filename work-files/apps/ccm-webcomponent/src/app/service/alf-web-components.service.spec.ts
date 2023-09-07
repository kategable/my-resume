import { BehaviorSubject, of } from 'rxjs';
import { AlfWebComponentService } from './alf-web-components.service';

describe('AlfWebComponentService', () => {
  let service: AlfWebComponentService;
  let apiHostMock: any;
  let windowsMock: any;
  const expected = [{ downloadUrl: 'tests', name: 'test' }];
  let documentMock = {
    createElement: (t: any) => {
      return { setAttribute: () => {}, addEventListener: () => {} };
    },
    getElementById: () => {},
    head: { appendChild: () => {} },
  };
  beforeEach(() => {
    apiHostMock = jasmine.createSpyObj('apiHostMock', ['getEnv']);
    apiHostMock.alfWcHost = 'testHost';

    windowsMock = {
      AlfWebComponentService: () => {
        return { fileSelection: { selectedNodes$: of(expected), entityState$: new BehaviorSubject({}) } };
      },
    };
    service = new AlfWebComponentService(apiHostMock as any, windowsMock as any, documentMock as any, {} as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load', () => {
    const spyLoadScript = spyOn(service, 'loadScript');
    service.load();
    expect(spyLoadScript).toHaveBeenCalled();
  });
  it('should showModal', async () => {
    const result = await service.showModal('test', 'test');
    expect(result).toEqual(expected as any);
  });
  it('should add to document when loadScript is called', () => {
    spyOn(documentMock, 'createElement').and.callThrough();
    spyOn(documentMock.head, 'appendChild');
    service.loadScript('test', 'url', true);

    expect(documentMock.createElement).toHaveBeenCalled();
    expect(documentMock.head.appendChild).toHaveBeenCalled();
  });
});
