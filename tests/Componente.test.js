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
}
