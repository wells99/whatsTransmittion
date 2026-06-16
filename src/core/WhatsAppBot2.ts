import { chromium, type BrowserContext, type Page } from 'playwright';
import * as fs from 'fs';

export class WhatsAppBot {
  private userDataDir: string;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor(userDataDir: string = './whatsapp-session') {
    this.userDataDir = userDataDir;
  }

  public async initialize(): Promise<Page> {
    const isFirstRun = !fs.existsSync(this.userDataDir);

    console.log(
      isFirstRun
        ? '🚀 Primeira execução: Modo VISUAL ativado.'
        : '🤖 Sessão encontrada: Iniciando em BACKGROUND...'
    );

    // 1. Descobre o User-Agent real do Playwright atual
    const tempBrowser = await chromium.launch({ headless: true });
    const tempContext = await tempBrowser.newContext();
    let baseUserAgent = await tempContext.pages()[0]?.evaluate(() => navigator.userAgent)
      || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
    await tempBrowser.close();

    // 2. Remove o dedo-duro "Headless" da string
    const cleanUserAgent = baseUserAgent.replace('HeadlessChrome', 'Chrome');

    // 3. Inicia sua sessão persistente com o User-Agent perfeito e sempre atualizado
    this.context = await chromium.launchPersistentContext(this.userDataDir, {
      headless: !isFirstRun,
      viewport: { width: 1280, height: 720 },
      userAgent: cleanUserAgent, 
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const firstPage = this.context.pages()[0];
    this.page = firstPage ?? await this.context.newPage();

    if (!this.page) {
      this.page = await this.context.newPage();
    }

    console.log('🌐 Navegando para o WhatsApp Web...');

    // Forçamos a espera até que o dom esteja carregado na navegação inicial
    await this.page.goto('https://web.whatsapp.com', { waitUntil: 'domcontentloaded' });

    const chatSearchSelector = 'img[src*=".cdn.whatsapp.net"]';

  

    if (isFirstRun) {
      console.log('📸 Por favor, escaneie o QR Code no navegador aberto...');
      await this.page.waitForSelector(chatSearchSelector, { timeout: 0 });
      console.log('✅ Autenticado com sucesso!');
    } else {
      console.log('⏳ Carregando o painel do WhatsApp Web...');
      await this.page.waitForSelector(chatSearchSelector, { timeout: 60000 });
      console.log('✅ Conectado e pronto!');
    }

    return this.page;
  }

  public async destroy(): Promise<void> {
    if (this.context) {
      await this.context.close();
      console.log('🛑 Instância do navegador encerrada.');
    }
  }
}