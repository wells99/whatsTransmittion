O mínimo que precisamos salvar para manter a sessão ativa
1. A abordagem mais segura
Salvar o conteúdo do diretório de perfil inteiro (whatsapp-session), ou ao menos as partes principais dele:

Local State — configuração global do perfil
Default/Cookies — cookies de autenticação
Default/Local Storage — dados locais do WhatsApp Web
Default/IndexedDB — tokens, dados de sessão e informações importantes do app
Default/Service Worker — cache/registro do service worker usado pelo WhatsApp Web
Default/Preferences — algumas preferências do perfil
Essa é a forma mais confiável porque o Chromium pode depender de vários arquivos para restaurar corretamente uma sessão.

2. O “mínimo prático”
Se for para simplificar, as informações realmente críticas para sessão de WhatsApp Web são:

Cookies
localStorage
possivelmente IndexedDB
Mas, para ter menos risco de quebra, recomendo não reduzir demais. WhatsApp Web usa bastante IndexedDB e service workers, então apenas cookies + localStorage pode não ser suficiente para manter a sessão em todas as vezes.

Como fazer isso em um banco de dados efêmero
Opção A: Persistir o diretório completo
Antes de encerrar, compactar ou serializar whatsapp-session
Salvar no banco como blob ou arquivo
Ao iniciar, recriar o diretório em disco com esses arquivos
Continuar usando launchPersistentContext(userDataDir, ...)
Essa é a forma que mais se parece com o comportamento atual.

Opção B: Salvar o estado do navegador
Melhor usar Playwright diretamente:

após login:
await context.storageState({ path: 'storageState.json' })
ao iniciar:
await browser.newContext({ storageState: 'storageState.json' })
Isso salva:

cookies
localStorage
sessionStorage (dependendo da API)
Mas atenção: essa abordagem pode não ser 100% suficiente para WhatsApp Web, pois ele também depende de IndexedDB/Service Worker em alguns casos.

Resposta direta para sua pergunta
Se for salvar no banco de dados, o recomendado é:

Default/Cookies
Default/Local Storage
Default/IndexedDB
Default/Service Worker
ou, mais seguro:

todo o diretório whatsapp-session
E se quiser um arquivo mínimo, use o storageState do Playwright, mas testando bem porque o WhatsApp Web pode exigir mais do que só cookies.

Conclusão
whatsapp-session atual salva a sessão por perfil completo de Chromium
o mínimo para manter sessão é combinar cookies + localStorage + IndexedDB
para garantia máxima, persista o diretório whatsapp-session inteiro e restaure em disco antes de iniciar o Playwright