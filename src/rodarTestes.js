document.addEventListener("DOMContentLoaded", () => {
  const resultadosDiv = document.getElementById("testes-resultados");

  // Função para limpar os resultados antes de rodar os testes
  function limparResultados() {
    resultadosDiv.textContent = "";
  }

  // Função global testar que registra o resultado dos testes
  window.testar = (nomeDoTeste, funcaoDeTeste) => {
    try {
      funcaoDeTeste();
      resultadosDiv.textContent += `✅ ${nomeDoTeste}\n`;
    } catch (erro) {
      resultadosDiv.textContent += `❌ ${nomeDoTeste} - ${erro.message}\n`;
    }
  };

  // Evento para rodar testes unitários (incluindo os extras)
  document.getElementById("rodarTestesUnitBtn").addEventListener("click", () => {
    limparResultados();

    if (typeof runUnitTests === "function") {
      runUnitTests();
    } else {
      resultadosDiv.textContent += "❌ Função runUnitTests() não encontrada!\n";
    }
  });

  // Evento para rodar testes de componente
  document.getElementById("rodarTestesComponentBtn").addEventListener("click", () => {
    limparResultados();

    if (typeof runComponentTests === "function") {
      runComponentTests();
    } else {
      resultadosDiv.textContent += "❌ Função runComponentTests() não encontrada!\n";
    }
  });
});
