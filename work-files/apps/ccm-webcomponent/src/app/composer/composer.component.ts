import { Component, Directive, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurationApiFacade } from '../api/configuration/configuration.api.facade';
import { AlfWebComponentService } from '../service/alf-web-components.service';
import { UiStateService } from '../service/ui-state.service';
import { ComposerView } from '../firm-request/enums/composer-view';
import { SentryMessage } from '../service/api.sentry.service';
@Directive({ selector: 'param-child' })
class ParamChild {}
@Component({
  selector: 'composer-component',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ComposerComponent {
  @Input() public paramMessage = '';
  @Input() public tag = '';
  @ViewChild('child') paramChild!: ElementRef;

  SentryMessage = SentryMessage; // to use SentryMessage in html

  constructor(
    private uiStateService: UiStateService,
    private alfWebComponentService: AlfWebComponentService,
    private configurationApiFacade: ConfigurationApiFacade
  ) {
    this.alfWebComponentService.load();
    this.configurationApiFacade.getBusinessContext('CASE').subscribe();
  }

  configurationSettings$ = this.uiStateService.configurationSettings$;
  loading$ = this.uiStateService.loading$;
  currentView$ = this.uiStateService.currentView$;
  composerView = ComposerView;

  isIntroView(currentView: ComposerView): boolean {
    return currentView === ComposerView.INTRO;
  }

  isCreateEnvelopeView(currentView: ComposerView): boolean {
    return currentView == ComposerView.CREATE_ENVELOPE;
  }
}
