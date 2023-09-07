// angular
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
// application
import { ConfigService } from './config.service';
import { ConfigFacade } from './config.facade';
import { Config } from './config.interface';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: Window, useValue: window }, ConfigFacade],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return exposed methods and values', () => {
    const UcfFileAssociation = service.CorrespondenceMgmt();
    expect(UcfFileAssociation.config).toBeTruthy();
  });

  it('config should update', () => {
    const passedConfig = new Config();
    passedConfig.businessContext.businessId = '123';
    const config = service.CorrespondenceMgmt(passedConfig).config;
    expect(config.businessContext.businessId).toEqual('123');
  });

  it('config contacts', () => {
    const config = new Config();
    const MOCK_CRDID = Math.ceil(Math.random() * 10000).toString();
    const MOCK_FIRMNAME = 'CUMBERLAND SECURITIES LLC';
    const MOCK_INDNAME = 'FirstName LastName';

    config.contacts = [
      {
        businessEmail: [],
        category: 'Firm',
        contactType: ['Potential Respondent'],
        crdId: MOCK_CRDID,
        name: MOCK_FIRMNAME,
        primaryFlag: true,
      },
      {
        businessEmail: ['TestUser3@gmail.com'],
        category: 'Rep',
        contactType: [],
        crdId: MOCK_CRDID,
        name: 'A T MCDOUGAL',
        primaryFlag: false,
      },
      {
        businessEmail: ['testIndividual@gmail.com'],
        category: 'Individual',
        contactType: [],
        name: MOCK_INDNAME,
        primaryFlag: false,
        crdId: MOCK_CRDID,
      },
      {
        businessEmail: [],
        category: 'Individual',
        contactType: [],
        name: MOCK_INDNAME,
        primaryFlag: false,
        crdId: MOCK_CRDID,
      },
    ];
    const emptyConfig = new Config();
    expect(Config.getFirmContacts(config)[0].category).toEqual('Firm');
    expect(Config.getFirmContacts(emptyConfig).length).toEqual(0);

    expect(Config.getFirmContact(config, MOCK_CRDID)?.name).toEqual(MOCK_FIRMNAME);
    expect(Config.getFirmContact(emptyConfig, MOCK_CRDID)).toBeUndefined();

    expect(Config.getFirmContactByName(config, MOCK_FIRMNAME)?.crdId).toEqual(MOCK_CRDID);
    expect(Config.getFirmContactByName(emptyConfig, MOCK_FIRMNAME)).toBeUndefined();

    expect(Config.getNonFirmContactsWithEmail(config).length).toEqual(2);
  });
});
