# Sistema de Nomes Automáticos de Projetos

## 🎯 Como Funciona

O Friendly agora gera automaticamente nomes criativos e descritivos para os projetos baseados no que o usuário descreve. O sistema funciona em duas etapas:

1. **Nome Rápido**: Gerado instantaneamente usando palavras-chave
2. **Nome com IA**: Gerado pela IA Gemini para ser mais criativo e profissional

## 📝 Exemplos de Nomes Gerados

### **Prompts de Portfolio**
- **Input**: "Crie um portfólio para um fotógrafo"
- **Nome Rápido**: "Portfolio Hub"
- **Nome com IA**: "Visual Showcase Studio"

### **Prompts de E-commerce**
- **Input**: "Faça uma loja online de roupas"
- **Nome Rápido**: "Shop Central"
- **Nome com IA**: "Fashion Marketplace"

### **Prompts de Blog**
- **Input**: "Construa um blog sobre tecnologia"
- **Nome Rápido**: "Blog Hub"
- **Nome com IA**: "Tech Insights"

### **Prompts de Dashboard**
- **Input**: "Crie um dashboard de vendas"
- **Nome Rápido**: "Dashboard Pro"
- **Nome com IA**: "Sales Analytics Hub"

### **Prompts de Aplicativo**
- **Input**: "Desenvolva um app de lista de tarefas"
- **Nome Rápido**: "Task Manager"
- **Nome com IA**: "Productivity Master"

### **Prompts de Landing Page**
- **Input**: "Faça uma landing page para startup"
- **Nome Rápido**: "Landing Central"
- **Nome com IA**: "Startup Launch Pad"

## 🔄 Fluxo de Funcionamento

### **1. Criação do Projeto**
```
Usuário digita: "Crie um site de receitas"
↓
Sistema gera nome rápido: "Recipe Hub"
↓
Projeto é criado instantaneamente
↓
IA gera nome melhor: "Culinary Discovery"
↓
Nome é atualizado automaticamente
```

### **2. Fallbacks Inteligentes**

**Sem Prompt Específico:**
- Nomes aleatórios: "Amazing Studio", "Creative Hub", "Modern Platform"

**Prompt Vago:**
- Extrai palavras-chave e gera: "Design Studio", "Web Central", "App Builder"

**Falha da IA:**
- Usa sistema de mapeamento de palavras-chave
- Sempre gera um nome válido

## 🎨 Categorias de Nomes

### **Sufixos Criativos**
- **Hub**: Para centros de atividade
- **Studio**: Para trabalhos criativos
- **Central**: Para sistemas organizacionais
- **Pro/Plus**: Para ferramentas profissionais
- **Express**: Para soluções rápidas
- **Lab**: Para experimentação

### **Mapeamento de Palavras-chave**
```javascript
portfolio → Creative Portfolio, Portfolio Hub, Showcase Studio
blog → Story Canvas, Content Hub, Blog Central
todo → Task Master, Todo Pro, Task Hub
shop → Digital Store, Shop Hub, Commerce Central
dashboard → Control Center, Analytics Hub, Data Central
```

## 🌟 Características do Sistema

### **Inteligente**
- Analisa o contexto do prompt
- Extrai palavras-chave relevantes
- Ignora palavras irrelevantes (stop words)

### **Criativo**
- Usa IA para gerar nomes únicos
- Combina palavras de forma inteligente
- Evita nomes genéricos como "Website" ou "App"

### **Rápido**
- Nome instantâneo para não bloquear o usuário
- Melhoria em background com IA
- Fallback sempre disponível

### **Multilíngue**
- Funciona em português, inglês e espanhol
- Remove stop words de cada idioma
- Gera nomes apropriados para cada contexto

## 💡 Exemplos Avançados

### **Prompts Complexos**
- **Input**: "Desenvolva uma plataforma de cursos online com sistema de pagamento"
- **Nome Gerado**: "Learning Academy Pro"

### **Prompts com Tecnologias**
- **Input**: "Crie um dashboard React com gráficos em tempo real"
- **Nome Gerado**: "Real-time Analytics"

### **Prompts de Nicho**
- **Input**: "Faça um site para veterinária com agendamento"
- **Nome Gerado**: "Pet Care Scheduler"

## 🔧 Configuração Técnica

### **Parâmetros da IA**
- **Modelo**: Gemini 2.5 Flash
- **Máximo**: 4 palavras
- **Estilo**: Title Case
- **Timeout**: 5 segundos (fallback automático)

### **Sistema de Cache**
- Nomes gerados são lembrados
- Evita regeneração desnecessária
- Melhora performance

### **Validação**
- Máximo 50 caracteres
- Sem caracteres especiais problemáticos
- Sempre retorna um nome válido

## 🎯 Benefícios para o Usuário

1. **Sem Preocupação**: Usuário não precisa pensar em nomes
2. **Profissional**: Nomes sempre adequados e criativos
3. **Contextual**: Reflete o propósito do projeto
4. **Único**: Cada projeto tem identidade própria
5. **Flexível**: Usuário pode alterar depois se quiser

O sistema de nomes automáticos torna a experiência do Friendly ainda mais fluida e profissional! 🚀