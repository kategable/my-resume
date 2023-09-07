import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ComposerComponent } from './composer/composer.component';
import { IntroComponent } from './intro/intro.component';
import { FirmRequestModule } from './firm-request/firm-request.module';
import { OutboxWebcomponent } from './outbox-webcomponent';
import { ItemDetailsCellRenderer } from './intro/item-details/item-details.component';
import { TestConfigComponent } from './test-config/test-config.component';
import { ConfigService } from './service/config/config.service';
import { LicenseManager } from 'ag-grid-enterprise';
import { ApiHostService } from './service/api.host.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

LicenseManager.setLicenseKey(
  'Using_this_AG_Grid_Enterprise_key_( AG-040509 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( Financial Industry Regulatory Authority, Inc, (Dallas, TX 75243) )_is_granted_a_( Single Application )_Developer_License_for_the_application_( Customer Correspondence Management - CCM )_only_for_( 3 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_( Customer Correspondence Management - CCM )_need_to_be_licensed___( Customer Correspondence Management - CCM )_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 30 April 2024 )____[v2]_MTcxNDQzMTYwMDAwMA==bccc1487ff9b5607b14d351f4c0a7e16'
);

@NgModule({
  declarations: [TestConfigComponent, OutboxWebcomponent, ComposerComponent, IntroComponent, ItemDetailsCellRenderer],
  imports: [BrowserModule, HttpClientModule, AgGridModule, FormsModule, FirmRequestModule],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private injector: Injector,
    private apiHostService: ApiHostService,
    // Todo: not being used
    private configService: ConfigService
  ) {}

  ngDoBootstrap() {
    const el1 = createCustomElement(TestConfigComponent, { injector: this.injector });
    if (!customElements.get('ccm-config')) {
      customElements.define('ccm-config', el1);
    }

    const el2 = createCustomElement(OutboxWebcomponent, { injector: this.injector });
    if (!customElements.get('ccm-outbox')) {
      customElements.define('ccm-outbox', el2);
    }

    const window = this.document.defaultView as any;
    if (!window.finra) {
      window.finra = {
        iconPath: this.apiHostService.iconPath,
      };
    } else {
      window.finra.iconPath = this.apiHostService.iconPath;
    }
  }
}
