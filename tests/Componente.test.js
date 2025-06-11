function runComponentTests() {
  testar("Atualizar a Tabela sem erro.", () => {
    salvarPedidos([{ id: 1, numeroCartao: "123", dataSolicitacao: "2024-06-01" }]);
    atualizarTabela(); // apenas para verificar se roda sem erro
    const linhas = document.querySelectorAll('#tabela-relatorio tbody tr');
    if (linhas.length === 0) throw new Error("Tabela não atualizada.");
  });

  testar("Remover o Pedido corretamente.", () => {
    salvarPedidos([{ id: 2, numeroCartao: "456", dataSolicitacao: "2024-06-01" }]);
    removerPedido(2);
    const pedidos = carregarPedidos();
    if (pedidos.length !== 0) throw new Error("Pedido não removido.");
  });

  testar("Seletor Tipo do Cartão possui as opções corretas", () => {
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
}

