document.addEventListener("DOMContentLoaded", () => {
    const resultadosDiv = document.getElementById("testes-resultados");
  
    window.testar = (nomeDoTeste, funcaoDeTeste) => {
      try {
        funcaoDeTeste();
        resultadosDiv.textContent += `✅ ${nomeDoTeste}\n`;
      } catch (erro) {
        resultadosDiv.textContent += `❌ ${nomeDoTeste} - ${erro.message}\n`;
      }
    };
  
    document.getElementById("rodarTestesUnitBtn").addEventListener("click", () => {
      resultadosDiv.textContent = "";
      if (typeof runUnitTests === "function") {
        runUnitTests();
      } else {
        resultadosDiv.textContent = "❌ Função runUnitTests() não encontrada!";
      }
    });
  
    document.getElementById("rodarTestesComponentBtn").addEventListener("click", () => {
      resultadosDiv.textContent = "";
      if (typeof runComponentTests === "function") {
        runComponentTests();
      } else {
        resultadosDiv.textContent = "❌ Função runComponentTests() não encontrada!";
      }
    });
  });