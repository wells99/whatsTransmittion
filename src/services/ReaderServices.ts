import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { PhoneService } from './PhoneService';
import { Contact } from './Contact';
import { ContactLimitService } from './ContactLimitService';

export class ReaderServices {
  /**
   * Reads contacts from a file (CSV or XLSX).
   * @param fileName Name of the file in the project root.
   * @returns A list of standardized contacts.
   */
  static async readFromFile(fileName: string): Promise<Contact[]> {
    const filePath = path.resolve(process.cwd(), fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    const contacts = this.standardize(data);
    
    // Check limits and potentially split contacts
    return await ContactLimitService.checkLimits(contacts);
  }

  /**
   * Standardizes manual input or raw data into a Contact array.
   * @param rawData Array of objects or strings.
   * @returns A list of standardized contacts.
   */
  static standardize(rawData: any[]): Contact[] {
    return rawData.map((item) => {
      if (typeof item === 'string') {
        return { phone: PhoneService.sanitize(item) };
      }

      // Try to find phone and name in various possible keys
      const phone = item.phone || item.Phone || item.telefone || item.Telefone || item.contact || item.Contact || '';
      const name = item.name || item.Name || item.nome || item.Nome || '';

      const sanitizedPhone = PhoneService.sanitize(phone.toString());

      return {
        name: name.toString().trim(),
        phone: sanitizedPhone,
      };
    }).filter(contact => PhoneService.isValid(contact.phone));
  }
}
