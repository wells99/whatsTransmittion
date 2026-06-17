import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import * as readline from 'readline';
import { Contact } from './Contact';

export class ContactLimitService {
  /**
   * Checks the number of contacts and applies limits or splitting logic.
   * @param contacts The list of contacts to check.
   * @returns The contacts to be used (if allowed).
   */
  static async checkLimits(contacts: Contact[]): Promise<Contact[]> {
    const total = contacts.length;

    // Hard limit: 4000 contacts
    if (total > 4000) {
      console.warn(`❌ Seu volume já passa de 4 mil contatos por mês \n o ideal seria ir para a api oficial pois a chance de banimento aumenta muito. \n ${total} contatos encontrados. estamos encerrando por aqui ❌ `);
      process.exit(1);
    }

    // Recommendation limit: 200 contacts
    if (total > 200) {
      console.log(`\n⚠️  Atenção: Sua lista contém ${total} contatos.`);
      console.log(`\n ------------------------------------------------`);
      console.log(`\n✅ Nossa recomendação de uso é: 200 contatos por vez.`);
      console.log(`Para grandes quantidades o ideal é usar a ferramenta oficial para evitar bloqueios e banimentos.`);
      
      const answer = await this.askQuestion("Deseja criar listas de 200 contatos com base na sua lista atual? (y/s para sim): ");
      
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 's') {
        this.splitIntoFiles(contacts);
        console.log("\n✅ Listas de 200 contatos foram criadas com sucesso.");
        console.log("O programa será encerrado. Por favor, utilize os novos arquivos para seus disparos.");
        process.exit(0);
      } else {
        console.log("⚠️  Prosseguindo com a lista original. Esteja ciente dos riscos de banimento.");
      }
    }

    return contacts;
  }

  /**
   * Asks a question to the user via CLI.
   */
  private static askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }));
  }

  /**
   * Splits the contacts into batches of 200 and saves them to CSV files.
   */
  private static splitIntoFiles(contacts: Contact[]) {
    const batchSize = 200;
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);
      const batchNumber = i + batchSize;
      const fileName = `contatos${batchNumber}.csv`;
      
      // Use XLSX to convert back to CSV to maintain format consistency
      const worksheet = XLSX.utils.json_to_sheet(batch);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      
      fs.writeFileSync(path.resolve(process.cwd(), fileName), csvContent);
      console.log(`📄 Arquivo criado: ${fileName}`);
    }
  }
}
