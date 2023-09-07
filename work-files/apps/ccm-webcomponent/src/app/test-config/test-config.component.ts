import { Component, Inject, OnInit } from '@angular/core';
import { ConfigFacade } from '../service/config/config.facade';
import { Config, Staffs } from '../service/config/config.interface';
import { ApiHostService } from '../service/api.host.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-config',
  templateUrl: './test-config.component.html',
  styleUrls: ['./test-config.component.scss'],
})
export class TestConfigComponent implements OnInit {
  public config: Config = new Config();
  public jsonError: any = undefined;

  constructor(
    private configFacade: ConfigFacade,
    private apiHostService: ApiHostService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.configFacade.config$.subscribe((config: Config) => (this.config = config));

    this.config.businessContext = {
      contextName: 'case',
      businessId: '20220744634',
      correlationId: '3d2c5660-94da-11ec-8589-8b794d92ee1a',
      client: 'RCM',
      templateId: '',
      businessObjects: [{ idKey: 'case', idValue: '20220744634' }],
    };

    switch (this.apiHostService.env) {
      case 'dev':
      case 'devint':
        this.config.businessContext.businessId = '20230460296';
        break;
      case 'qa':
      case 'qaint':
        this.config.businessContext.businessId = '20220744634';
        break;
    }
    // take parameters from URL hash like:
    // http....#businessId=12345&client=RCM&policyTag=RCM-Open
    const window = this.document.defaultView as any;
    const hash = window?.location?.hash;
    if (hash && hash.startsWith('#')) {
      const params: string[] = hash.substring(1).split('&');
      params.forEach((p) => {
        const nv: string[] = p.split('=');
        if (nv.length == 2) {
          if (nv[0] == 'businessId') this.config.businessContext.businessId = nv[1];
          else if (nv[0] == 'client') this.config.businessContext.client = nv[1];
          else if (nv[0] == 'policyTag') this.config.accessPolicyToApply.tag = nv[1];
        }
      });
    }

    this.config.contacts = [
      {
        businessEmail: ['TestUser1@gmail.com'],
        category: 'Rep',
        contactType: [],
        crdId: '1440347',
        name: 'A PAUL MARTIN',
        primaryFlag: false,
      },
      {
        businessEmail: [],
        category: 'Firm',
        contactType: ['Potential Respondent'],
        crdId: '13970',
        name: 'CUMBERLAND SECURITIES LLC',
        primaryFlag: true,
      },
      {
        businessEmail: [],
        category: 'Firm',
        contactType: ['Potential Respondent'],
        crdId: '13971',
        name: 'HILLTOP SECURITIES INC.',
        primaryFlag: true,
      },
      {
        businessEmail: ['TestUser3@gmail.com'],
        category: 'Rep',
        contactType: [],
        crdId: '2640776',
        name: 'A T MCDOUGAL',
        primaryFlag: false,
      },
      {
        businessEmail: ['testIndividual@gmail.com'],
        category: 'Individual',
        contactType: [],
        name: 'FirstName LastName',
        primaryFlag: false,
        crdId: '123',
      },
      {
        businessEmail: ['test@gmail.com'],
        category: 'Rep',
        contactType: [],
        crdId: '7088023',
        name: 'A Alexander Friedberg',
        primaryFlag: true,
      },
      {
        businessEmail: [],
        category: 'Branch',
        contactType: ['Potential Respondent'],
        crdId: '250',
        name: 'EDWARD JONES',
        primaryFlag: false,
      },
      {
        businessEmail: ['TestUser2@gmail.com'],
        category: 'Rep',
        contactType: [],
        crdId: '3119638',
        name: 'A Perry Chappell',
        primaryFlag: false,
      },
    ] as any;
    this.config.staffs = [
      {
        userId: 'K31038',
        fullName: 'Todd Smith',
        primaryFlag: true,
        role: 'Supervisor',
      },
      {
        userId: 'K31038',
        fullName: 'Todd Smith',
        primaryFlag: true,
        role: 'Manager',
      },
      {
        userId: 'K31038',
        fullName: 'Todd Smith',
        primaryFlag: true,
        role: 'Analyst',
      },
      {
        userId: 'K22394',
        fullName: 'Socrates Geetha Sambandam',
        primaryFlag: false,
        role: 'Supervisor',
      },
      {
        userId: 'K22394',
        fullName: 'Socrates Geetha Sambandam',
        primaryFlag: false,
        role: 'Manager',
      },
      {
        userId: 'K22394',
        fullName: 'Socrates Geetha Sambandam',
        primaryFlag: false,
        role: 'Analyst',
      },
    ] as Staffs[];
    this.updateConfig();
  }

  keyUp(event: any) {
    this.jsonError = undefined;
    try {
      const jsonConfig = JSON.parse(event.target.value.replace(/[\n]/g, ''));
      this.config = jsonConfig;
    } catch (error: any) {
      this.jsonError = error;
    }
  }

  updateConfig() {
    this.configFacade.updateConfig(this.config);
  }
}
