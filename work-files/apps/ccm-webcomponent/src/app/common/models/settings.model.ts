import { Actor } from '../../service/api.sentry.service';
import { Config } from '../../service/config/config.interface';

export interface ConfigurationSettings {
  config: Config;
  enabledDefaultTemplate: boolean;
  defaultTemplateName: string | undefined;
  enabledEnvelopeLocalImport: boolean;
  currentUser: { username: string | null; error?: any } | null;
}
