export class PhoneService {
  /**
   * Cleans the phone number by removing all non-numeric characters.
   */
  static sanitize(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Validates if the phone number is in a format acceptable by WhatsApp.
   * Standard: [Country Code][Area Code][Number]
   * Usually between 10 and 15 digits.
   */
  static isValid(phone: string): boolean {
    const sanitized = this.sanitize(phone);
    // Basic validation: minimum length for a valid international number
    return sanitized.length >= 10 && sanitized.length <= 15;
  }

  /**
   * Formats the phone number strictly for the WhatsApp Web URL.
   * WhatsApp Web URL expects digits only, no '+' or leading zeros.
   */
  static formatForWhatsApp(phone: string): string {
    let sanitized = this.sanitize(phone);
    
    // Optional: Add logic here to prepend default country code if missing
    // e.g., if (sanitized.length === 11) sanitized = '55' + sanitized;

    return sanitized;
  }

  /**
   * Generates a valid WhatsApp Web URL for sending a message.
   */
  static generateUrl(phone: string, text: string): string {
    const formattedPhone = this.formatForWhatsApp(phone);
    const encodedText = encodeURIComponent(text);
    return `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
  }
}
