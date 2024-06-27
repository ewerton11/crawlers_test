# Guia de Instalação e Execução do Projeto

## Baixar o Projeto

Clone o repositório e acesse o diretório do projeto:

```bash
git clone https://github.com/ewerton11/crawlers_test.git
cd crawlers_test
```

## Instalar Dependências

```bash
npm install
```

## Build do Projeto

```bash
npm run build
```

## Iniciar o Projeto

```bash
npm start
```

## Rotas:

1. `/process`
   - **Método:** POST
   - **Descrição:** Esta rota retorna os detalhes de um processo com base no número de processo fornecido.
   - **Corpo da Requisição:**
  
     ```json
     {
       "processNumber": "5044116-91.2023.8.13.0024"
     }
     ```
