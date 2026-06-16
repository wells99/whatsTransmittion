import type { Page } from 'playwright';

export class DelayService {
  /**
   * Gera um número aleatório entre min e max (inclusive)
   */
  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Aplica uma pausa aleatória entre minSeconds e maxSeconds para humanização
   * @param page Página do Playwright
   * @param minSeconds Mínimo de segundos (padrão 45)
   * @param maxSeconds Máximo de segundos (padrão 79)
   */
  static async waitRandom(page: Page, minSeconds: number = 45, maxSeconds: number = 79): Promise<void> {
    const delay = this.getRandomInt(minSeconds, maxSeconds);
    console.log(`⏱️ Humanização: Aguardando ${delay} segundos até o próximo envio...`);
    await page.waitForTimeout(delay * 1000);
  }

  /**
   * Aplica uma pausa fixa em segundos
   * @param page Página do Playwright
   * @param seconds Segundos a aguardar
   */
  static async wait(page: Page, seconds: number): Promise<void> {
    await page.waitForTimeout(seconds * 1000);
  }
}
