function runUnitTests() {
  testar("Validar datas válidas.", () => {
    if (!validarDatas("2024-06-01", "2024-06-02")) throw new Error("Deveria aceitar data futura.");
  });

  testar("Validar datas inválidas.", () => {
    if (validarDatas("2024-06-02", "2024-06-01")) throw new Error("Não deveria aceitar data anterior.");
  });

  testar("Calcular Status para verificar se a entrega ocorreu dentro do prazo.", () => {
    const pedido = { dataSolicitacao: "2024-06-01", dataEntrega: "2024-06-03" };
    const resultado = calcularStatus(pedido);
    if (resultado.status !== "Entregue no Prazo") throw new Error("Status errado.");
  });

  testar("Salvar e Relacionar os pedidos.", () => {
    const teste = [{ id: 1, numeroCartao: "999", dataSolicitacao: "2024-06-01" }];
    salvarPedidos(teste);
    const resultado = carregarPedidos();
    if (resultado.length !== 1 || resultado[0].id !== 1) throw new Error("Erro ao salvar/relacionar o pedido.");
  });
}
