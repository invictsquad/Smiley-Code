// Prompts de teste para verificar se o sistema está funcionando
export const testPrompts = {
  simpleApp: "Crie uma aplicação web simples com um contador que tem botões para aumentar e diminuir o valor",
  
  todoApp: "Crie um aplicativo de lista de tarefas com as seguintes funcionalidades: adicionar tarefa, marcar como concluída, remover tarefa e filtrar por status",
  
  calculator: "Crie uma calculadora web com operações básicas (soma, subtração, multiplicação, divisão) e uma interface moderna",
  
  portfolio: "Crie um site de portfólio pessoal com seções: sobre mim, projetos, habilidades e contato",
  
  landingPage: "Crie uma landing page para um aplicativo móvel com seção hero, recursos, depoimentos e call-to-action"
};

// Função para testar o sistema
export async function testSmileyCodeSystem() {
  console.log('🧪 Iniciando teste do sistema Smiley Code...');
  
  // Ativar debug
  if (typeof window !== 'undefined') {
    (window as any).SmileyDebug?.enable();
  }
  
  console.log('✅ Sistema de teste carregado');
  console.log('📝 Prompts disponíveis:', Object.keys(testPrompts));
  console.log('💡 Use: testSmileyCodeSystem() no console para executar');
}