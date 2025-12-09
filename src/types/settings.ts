import { TagResponse, TagItemDTO } from "./tag";
import {
  MessageTemplateResponse,
  MessageTemplateItemDTO,
} from "./messageTemplate";
import {
  EmailSignatureResponse,
  UpdateEmailSignatureDTO,
} from "./emailSignature";
import {
  ConfigurationResponse,
  UpdateConfigurationItemDTO,
} from "./configuration";

export interface AllSettingsResponse {
  tags: TagResponse[];
  messageTemplates: MessageTemplateResponse[];
  emailSignature: EmailSignatureResponse | null;
  configurations: ConfigurationResponse[];
}

export interface UpdateAllSettingsDTO {
  tags?: TagItemDTO[];
  messageTemplates?: MessageTemplateItemDTO[];
  emailSignature?: UpdateEmailSignatureDTO;
  configurations?: UpdateConfigurationItemDTO[];
}
