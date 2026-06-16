import { WhatsAppBot } from './src/core/WhatsAppBot';
import { MessageService } from './src/services/MessageService';
import { ReaderServices, Contact } from './src/services/ReaderServices';

async function main() {
  // 1. Carrega os contatos de um arquivo na raiz (CSV ou XLSX)
  // O ReaderServices.readFromFile retorna um array de objetos [{ name, phone }]
  let listaContatosObjetos: Contact[] = [];
  
  try {
    listaContatosObjetos = ReaderServices.readFromFile('contatos.csv');
    console.log(`📋 Carregados ${listaContatosObjetos.length} contatos do arquivo.`);
  } catch (error) {
    console.warn('⚠️ Arquivo contatos.csv não encontrado ou erro na leitura. Usando entrada manual.');
    // Exemplo de entrada manual via ReaderServices.standardize
    listaContatosObjetos = ReaderServices.standardize([
      { nome: 'Teste Manual', telefone: '5585999999999' }
    ]);
  }

  // 2. Extrai apenas os números para o MessageService
  const listaNumeros = listaContatosObjetos.map(c => c.phone);
  const mensagem = 'Você é a melhor parte dos meus dias. Meu coração sorri toda vez que penso em você. Te amo infinitamente, meu amor! \n *WhatsTransmittion*';

  if (listaNumeros.length === 0) {
    console.log('❌ Ninguém para enviar mensagem.');
    return;
  }

  // 3. Instancia e inicializa o Bot
  const bot = new WhatsAppBot();
  const page = await bot.initialize();

  // 4. Instancia o serviço de envio passando a página ativa e configurando 1 minuto de delay (opcional)
  const messenger = new MessageService(page, 1);

  try {
    // 5. Executa o disparo em lote
    await messenger.sendBulk(listaNumeros, mensagem);
    
  } catch (error) {
    console.error('Ocorreu um erro durante a execução dos disparos:', error);
  } finally {
    // 6. Fecha o navegador ao terminar tudo
    await bot.destroy();
  }
}

main();