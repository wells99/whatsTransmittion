O que temos em whatsapp-session
A pasta whatsapp-session contém um perfil de navegador Chrome/Chromium usado pelo WhatsApp Web. Esses arquivos e pastas guardam dados da sessão, configurações, cache e estado do navegador, permitindo que a sessão seja restaurada entre execuções.

O que faz cada item
BrowserMetrics/

Guarda métricas de desempenho e uso do navegador.
Normalmente usado internamente pelo Chrome/Chromium para relatórios e diagnósticos.
component_crx_cache/

Armazena extensões ou componentes do navegador baixados como CRX.
Facilita recarregar esses componentes sem baixar de novo.
Crashpad/

Contém relatórios de crashes e dados de falhas do navegador.
Usado para registrar erros se o browser travar.
Default/

É a pasta principal do perfil do Chrome/Chromium.
Inclui histórico, cookies, local storage, cache de site, sessões, preferências e outros dados usados pelo WhatsApp Web.
extensions_crx_cache/

Similar a component_crx_cache/, mas voltado para extensões.
Guarda pacotes de extensões em cache.
first_party_sets.db e first_party_sets.db-journal

Banco de dados SQLite usado pelo navegador para gerenciar “First Party Sets”.
Esse recurso ajuda a tratar sites relacionados como parte de um mesmo conjunto para cookies e privacidade.
GraphiteDawnCache/

Cache gráfico usado pelo Chromium para o motor Dawn/WebGPU.
Armazena dados de renderização e compilação ligados a gráficos.
GrShaderCache/

Cache de shaders GPU.
Ajuda o navegador a não recompilar shaders gráficos a cada execução.
Last Browser

Indica a versão ou tipo de navegador usado na última sessão.
Pode ser um arquivo com nome que serve para identificação interna.
Last Version

Registra a última versão do navegador Chrome/Chromium usada.
Ajuda o perfil a detectar atualizações ou mudanças de versão.
Local State

Arquivo JSON com configurações globais do navegador para esse perfil.
Guarda preferências gerais e estado do perfil.
Safe Browsing/

Pasta com dados do recurso de navegação segura do Chrome.
Contém informações de proteção contra sites maliciosos e phishing.
segmentation_platform/

Dados da plataforma de segmentação do Chrome.
Usado para decisões internas de recursos baseadas em comportamento.
ShaderCache/

Outro cache de shaders gráficos para renderização.
Ajuda no desempenho de sites que usam WebGL ou gráficos acelerados.
Variations

Contém configurações de “field trials” e experimentos do Chromium.
O navegador usa isso para habilitar/desabilitar variações de recursos.
Em resumo, a pasta whatsapp-session não é do WhatsApp em si, mas sim um perfil de navegador completo usado para manter a sessão do WhatsApp Web funcionando com histórico, cookies, cache e configurações do browser.