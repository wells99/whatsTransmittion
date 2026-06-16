import { WhatsAppBot } from './src/core/WhatsAppBot';
import { MessageService } from './src/services/MessageService';
import { ReaderServices, Contact } from './src/services/ReaderServices';

async function main() {

  let listaContatosObjetos: Contact[] = [];
  
  try {
    listaContatosObjetos = ReaderServices.readFromFile('contatos.csv');
    console.log(`📋 Carregados ${listaContatosObjetos.length} contatos do arquivo.`);
  } catch (error) {
    console.warn('⚠️ Arquivo de contatos não encontrado ou erro na leitura.');
    // Exemplo de entrada manual via ReaderServices.standardize
    listaContatosObjetos = ReaderServices.standardize([
      { nome: 'WM', telefone: '5585999999999' }
    ]);
  }

  // 2. Extrai apenas os números para o MessageService
  const listaNumeros = listaContatosObjetos.map(c => c.phone);
  const mensagem = 'Sabe o que o zero disse para o oito? \n– Que cinto maneiro! \n \n*WhatsTransmittion*';

  
  // EXEMPLO DE USO DO GERENCIADOR DE TEMPLATES:
  // 1. Defina um template com variáveis como {nome}
  const templateMensagem = 'fala {nome} de boas? tava pensando num churrasco 🔥 ó que tu acha ? \n \n*WhatsTransmittion*';
  
 
 

  if (listaNumeros.length === 0) {
    console.log('❌ Ninguém para enviar mensagem.');
    return;
  }

  // 3. Instancia e inicializa o Bot
  const bot = new WhatsAppBot();
  const page = await bot.initialize();

  // 4. Instancia o serviço de envio passando a página ativa (o delay agora é aleatório e humanizado)
  const messenger = new MessageService(page);

  try {
    // 5. Executa o disparo em lote
    // await messenger.sendBulk(listaNumeros, mensagem);

     // Aqui você pode usar o TemplateService para enviar mensagens personalizadas
    await messenger.sendBulkPersonalized(listaContatosObjetos, templateMensagem);
    
  } catch (error) {
    console.error('Ocorreu um erro durante a execução dos disparos:', error);
  } finally {
    // 6. Fecha o navegador ao terminar tudo
    await bot.destroy();
  }
}

main();