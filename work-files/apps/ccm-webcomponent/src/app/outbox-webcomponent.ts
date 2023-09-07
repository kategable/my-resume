import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ConfigFacade } from './service/config/config.facade';
import { Config } from './service/config/config.interface';
import { UiStateService } from './service/ui-state.service';
import { LogService } from './service/log.service';

@Component({
  templateUrl: './outbox-webcomponent.html',
  styleUrls: ['./outbox-webcomponent.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class OutboxWebcomponent implements OnInit, OnChanges {
  private _config: Config = new Config();

  constructor(private uiStateService: UiStateService, private configFacade: ConfigFacade, private log: LogService) {}

  @Input('config') config: Config | undefined = undefined;
  @Output() ccmLoaded: EventEmitter<Config> = new EventEmitter();
  ngOnInit() {
    this.uiStateService.start();
    this.log.info('ccm outbox-loaded');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) return;

    // parse incoming config
    const config = changes['config']?.currentValue;
    this._config = config ? { ...this._config, ...config } : this._config;

    // update config
    this.updateConfig();
  }

  updateConfig() {
    this.configFacade.updateConfig(this._config);
    this.ccmLoaded.emit(this._config);
  }
}
