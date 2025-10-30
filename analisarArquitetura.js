const fs = require("fs");
const path = require("path");

// Configuração dos diretórios
const BACKEND_DIR = path.join(__dirname, "server");
const FRONTEND_DIR = path.join(__dirname, "client");

const EXT_JS_TS = [".js", ".ts", ".tsx"];

// Função recursiva para listar arquivos
function listarArquivos(dir, arquivos = []) {
  const lista = fs.readdirSync(dir);
  lista.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      listarArquivos(fullPath, arquivos);
    } else if (EXT_JS_TS.includes(path.extname(item))) {
      arquivos.push(fullPath);
    }
  });
  return arquivos;
}

// Função simples para extrair imports de cada arquivo
function extrairImports(conteudo) {
  const regex = /require\(['"`](.+?)['"`]\)|import .* from ['"`](.+?)['"`]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(conteudo))) {
    matches.push(match[1] || match[2]);
  }
  return matches;
}

// Função para varrer arquivos e coletar informações básicas
function analisarArquivos(arquivos) {
  const resultados = [];
  arquivos.forEach((file) => {
    const conteudo = fs.readFileSync(file, "utf-8");
    const imports = extrairImports(conteudo);
    resultados.push({
      arquivo: file,
      imports,
      tamanhoLinhas: conteudo.split("\n").length,
    });
  });
  return resultados;
}

// Função para detectar possíveis rotas (express .get/.post/.put/.delete)
function detectarRotas(arquivos) {
  const rotas = [];
  const regex = /\.([get|post|put|delete]+)\(['"`](.+?)['"`],/g;
  arquivos.forEach((file) => {
    const conteudo = fs.readFileSync(file, "utf-8");
    let match;
    while ((match = regex.exec(conteudo))) {
      rotas.push({
        metodo: match[1].toUpperCase(),
        endpoint: match[2],
        arquivo: file,
      });
    }
  });
  return rotas;
}

// Executar análise
console.log("🚀 Iniciando análise do projeto...");

const arquivosBackend = listarArquivos(BACKEND_DIR);
const arquivosFrontend = listarArquivos(FRONTEND_DIR);

const importsBackend = analisarArquivos(arquivosBackend);
const importsFrontend = analisarArquivos(arquivosFrontend);

const rotasDetectadas = detectarRotas(arquivosBackend);

// Gerar relatório JSON
const relatorio = {
  backend: {
    totalArquivos: arquivosBackend.length,
    arquivos: importsBackend,
    rotas: rotasDetectadas,
  },
  frontend: {
    totalArquivos: arquivosFrontend.length,
    arquivos: importsFrontend,
  },
  resumo: {
    totalArquivos: arquivosBackend.length + arquivosFrontend.length,
  },
};

// Salvar relatório
fs.writeFileSync("relatorioArquitetura.json", JSON.stringify(relatorio, null, 2));

console.log("✅ Relatório gerado: relatorioArquitetura.json");
