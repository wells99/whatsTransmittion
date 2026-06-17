import { Contact } from './Contact';

export class TemplateService {
  /**
   * Processes a template string by replacing placeholders with contact data.
   * Example: "Hello {nome}!" -> "Hello Joao!"
   * 
   * @param template The base text with placeholders like {nome} or {name}.
   * @param contact The contact object containing the data.
   * @returns The personalized message.
   */
  static process(template: string, contact: Contact): string {
    let personalized = template;

    // Replace {nome} or {name} with contact name
    if (contact.name) {
      personalized = personalized.replace(/{nome}/gi, contact.name);
      personalized = personalized.replace(/{name}/gi, contact.name);
    } else {
      // Fallback if name is missing
      personalized = personalized.replace(/{nome}/gi, 'cliente');
      personalized = personalized.replace(/{name}/gi, 'cliente');
    }

    // You can add more variables here if the Contact interface grows
    // e.g., personalized = personalized.replace(/{phone}/gi, contact.phone);

    return personalized;
  }

  /**
   * Processes a template for a list of contacts.
   * Useful for previewing or batch processing.
   */
  static processBatch(template: string, contacts: Contact[]): string[] {
    return contacts.map(contact => this.process(template, contact));
  }
}
