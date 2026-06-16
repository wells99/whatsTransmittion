import type { Page } from 'playwright';
import { PhoneService } from './PhoneService';
import { Contact } from './ReaderServices';
import { TemplateService } from './TemplateService';

export class MessageService {
  private page: Page;
  private delayMs: number;

  // Deixamos o delay configurável (padrão 1 minuto)
  constructor(page: Page, delayMinutes: number = 1) {
    this.page = page;
    this.delayMs = delayMinutes * 60 * 1000;
  }

  /**
   * Envia uma mensagem para um único número
   */
  public async send(phone: string, text: string): Promise<boolean> {
    if (!PhoneService.isValid(phone)) {
      console.error(`❌ Número inválido ignorado: ${phone}`);
      return false;
    }

    console.log(`\n⏳ Preparando envio para: ${phone}`);

    const url = PhoneService.generateUrl(phone, text);

    try {
      await this.page.goto(url);

      // Seletores comuns do WhatsApp Web para o botão de envio
      const sendButtonSelector = 'span[data-testid="wds-ic-send-filled"]';

      // Aguarda o botão de envio ficar disponível e clica
      await this.page.waitForSelector(sendButtonSelector, { timeout: 20000 });
      await this.page.click(sendButtonSelector);

      console.log(`✅ Mensagem enviada com sucesso para ${phone}`);
      return true;
    } catch (error) {
      console.error(`❌ Falha ao enviar para ${phone}. O número pode estar incorreto ou a página demorou a responder.`);
      return false;
    }
  }

  /**
   * Processa uma lista completa de contatos com espaçamento de tempo
   */
  public async sendBulk(numbers: string[], text: string): Promise<void> {
    for (let i = 0; i < numbers.length; i++) {
      const currentNumber = numbers[i];

      await this.send(currentNumber ?? "", text);

      // Se não for o último número da lista, aplica o delay
      if (i < numbers.length - 1) {
        console.log(`⏱️ Aguardando ${this.delayMs / 1000} segundos até o próximo envio...`);
        await this.page.waitForTimeout(this.delayMs);
      } else {
        console.log('⏱️ Aguardando 5 segundos para confirmar a saída da última mensagem...');
        await this.page.waitForTimeout(5000);
      }

    }
    console.log('\n🏁 Todos os envios da lista foram processados!');
  }

  /**
   * Processa uma lista de contatos com mensagens personalizadas via TemplateService
   */
  public async sendBulkPersonalized(contacts: Contact[], template: string): Promise<void> {
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const personalizedMessage = TemplateService.process(template, contact);

      await this.send(contact.phone, personalizedMessage);

      if (i < contacts.length - 1) {
        console.log(`⏱️ Aguardando ${this.delayMs / 1000} segundos até o próximo envio...`);
        await this.page.waitForTimeout(this.delayMs);
      } else {
        console.log('⏱️ Aguardando 5 segundos para confirmar a saída da última mensagem...');
        await this.page.waitForTimeout(5000);
      }
    }
    console.log('\n🏁 Todos os envios personalizados foram processados!');
  }
}