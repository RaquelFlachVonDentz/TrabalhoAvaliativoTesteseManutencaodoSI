function runComponentTests() {
  testar("Verificar se o seletor Tipo do Cartão possui as opções corretas.", () => {
    const seletor = document.getElementById("tipoCartao");
    if (!seletor) throw new Error("Seletor 'tipoCartao' não encontrado.");

    const opcoesEsperadas = [
      { value: "", text: "Selecione..." },
      { value: "débito", text: "Débito" },
      { value: "crédito", text: "Crédito" },
      { value: "múltiplo", text: "Múltiplo" }
    ];

    const opcoesReais = Array.from(seletor.options).map(opt => ({ value: opt.value, text: opt.text }));

    if (opcoesReais.length !== opcoesEsperadas.length)
      throw new Error(`Número de opções esperado: ${opcoesEsperadas.length}, encontrado: ${opcoesReais.length}`);

    opcoesEsperadas.forEach((esperada, index) => {
      const real = opcoesReais[index];
      if (real.value !== esperada.value || real.text !== esperada.text) {
        throw new Error(`Opção na posição ${index} esperada: {value: "${esperada.value}", text: "${esperada.text}"}, encontrada: {value: "${real.value}", text: "${real.text}"}`);
      }
    });
  });

  testar("Verificar a existência dos inputs e do select no formulário.", () => {
    const idsEsperados = [
      "numeroCartao",
      "tipoCartao",
      "fabricante",
      "dataSolicitacao",
      "dataEntrega"
    ];

    idsEsperados.forEach(id => {
      const elemento = document.getElementById(id);
      if (!elemento) throw new Error(`Elemento com id="${id}" não encontrado.`);
      // opcional: verificar se é input ou select conforme esperado
      if (id === "tipoCartao" && elemento.tagName.toLowerCase() !== "select") {
        throw new Error(`Elemento com id="${id}" deveria ser um <select>.`);
      }
      if (id !== "tipoCartao" && elemento.tagName.toLowerCase() !== "input") {
        throw new Error(`Elemento com id="${id}" deveria ser um <input>.`);
      }
    });
  });

  testar("Verificar os atributos dos campos do formulário.", () => {
    const campos = [
      { id: "numeroCartao", type: "text", required: true, label: "Nº do Cartão" },
      { id: "tipoCartao", tag: "select", required: true, label: "Tipo do Cartão" },
      { id: "fabricante", type: "text", required: true, label: "Fabricante" },
      { id: "dataSolicitacao", type: "date", required: true, label: "Data da Solicitação" },
      { id: "dataEntrega", type: "date", required: false, label: "Data da Entrega" },
    ];

    campos.forEach(campo => {
      const el = document.getElementById(campo.id);
      if (!el) throw new Error(`Campo com id="${campo.id}" não encontrado.`);

      // Verificar se é input ou select conforme necessário
      if (campo.tag === "select") {
        if (el.tagName.toLowerCase() !== "select") {
          throw new Error(`Campo "${campo.id}" deveria ser um <select>.`);
        }
      } else {
        if (el.tagName.toLowerCase() !== "input") {
          throw new Error(`Campo "${campo.id}" deveria ser um <input>.`);
        }
        // Verificar tipo do input
        if (el.type !== campo.type) {
          throw new Error(`Campo "${campo.id}" deveria ser do tipo "${campo.type}", mas é "${el.type}".`);
        }
      }

      // Verificar atributo required
      const isRequired = el.hasAttribute("required");
      if (campo.required && !isRequired) {
        throw new Error(`Campo "${campo.id}" deveria ser obrigatório (required).`);
      }
      if (!campo.required && isRequired) {
        throw new Error(`Campo "${campo.id}" **não** deveria ser obrigatório.`);
      }

      // Verificar se label correspondente existe e tem o texto esperado
      const label = document.querySelector(`label[for="${campo.id}"]`);
      if (!label) throw new Error(`Label para o campo "${campo.id}" não encontrada.`);
      if (!label.textContent.includes(campo.label)) {
        throw new Error(`Label de "${campo.id}" deveria conter "${campo.label}", mas tem "${label.textContent}".`);
      }
    });
  });

  testar("Verificar a existência e as propriedades dos botões do formulário.", () => {
    const botoes = [
      {
        id: "formulario-pedido", // dentro desse form
        botaoIndex: 0,
        expectedText: "Adicionar Pedido",
        expectedType: "submit",
      },
      {
        id: "btn-exportar",
        expectedText: "Exportar CSV",
        expectedType: "button",
      }
    ];

    // Verifica botão de envio dentro do formulário
    const formulario = document.getElementById("formulario-pedido");
    if (!formulario) throw new Error("Formulário com id='formulario-pedido' não encontrado.");

    const botoesNoFormulario = formulario.querySelectorAll("button");
    if (!botoesNoFormulario.length) throw new Error("Nenhum botão encontrado dentro do formulário.");

    const botaoAdicionar = botoesNoFormulario[0];
    if (botaoAdicionar.textContent.trim() !== botoes[0].expectedText)
      throw new Error(`Texto do botão esperado: "${botoes[0].expectedText}", encontrado: "${botaoAdicionar.textContent.trim()}"`);

    if (botaoAdicionar.type !== botoes[0].expectedType)
      throw new Error(`Tipo do botão esperado: "${botoes[0].expectedType}", encontrado: "${botaoAdicionar.type}"`);

    if (botaoAdicionar.disabled)
      throw new Error(`O botão "${botaoAdicionar.textContent.trim()}" não deveria estar desabilitado.`);

    // Verifica botão Exportar CSV
    const botaoExportar = document.getElementById(botoes[1].id);
    if (!botaoExportar) throw new Error(`Botão com id="${botoes[1].id}" não encontrado.`);

    if (botaoExportar.textContent.trim() !== botoes[1].expectedText)
      throw new Error(`Texto do botão esperado: "${botoes[1].expectedText}", encontrado: "${botaoExportar.textContent.trim()}"`);

    if (botaoExportar.type !== botoes[1].expectedType)
      throw new Error(`Tipo do botão esperado: "${botoes[1].expectedType}", encontrado: "${botaoExportar.type}"`);

    if (botaoExportar.disabled)
      throw new Error(`O botão "${botaoExportar.textContent.trim()}" não deveria estar desabilitado.`);
  });

}

