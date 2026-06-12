import { WhatsAppBot } from './src/core/WhatsAppBot';
import { MessageService } from './src/services/MessageService';

async function main() {
  // 1. Instancia e inicializa o Bot
  const bot = new WhatsAppBot();
  const page = await bot.initialize();

  // 2. Instancia o serviço de envio passando a página ativa e configurando 1 minuto de delay
  const messenger = new MessageService(page, 1);

  // 3. Dados fictícios para o envio
  const listaContatos = ['5585999999999','5585999999999']; 
  const mensagem = 'Olá! Esta é uma mensagem de teste automatizada 🚀';

  try {
    // 4. Executa o disparo em lote
    await messenger.sendBulk(listaContatos, mensagem);
    
  } catch (error) {
    console.error('Ocorreu um erro durante a execução dos disparos:', error);
  } finally {
    // 5. Fecha o navegador ao terminar tudo
    await bot.destroy();
  }
}

main();