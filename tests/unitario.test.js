function runUnitTests() {

    testar("Validar datas válidas.", () => {
        if (!validarDatas("2024-06-01", "2024-06-02")) throw new Error("Deveria aceitar data futura.");
    });

    testar("Validar datas inválidas.", () => {
        if (validarDatas("2024-06-02", "2024-06-01")) throw new Error("Não deveria aceitar data anterior.");
    });

    testar("Validar datas com a data da entrega vazia (entrega opcional).", () => {
        if (!validarDatas("2024-06-01", "")) throw new Error("Deveria aceitar Data da Entrega vazia.");
    });

    testar("Calcular status para verificar se a entrega ocorreu dentro do prazo.", () => {
        const pedido = { dataSolicitacao: "2024-06-01", dataEntrega: "2024-06-03" };
        const resultado = calcularStatus(pedido);
        if (resultado.status !== "Entregue no Prazo") throw new Error("Status errado.");
    });

    testar("Calcular status para pedidos sem data da entrega (não entregue).", () => {
        const pedido = { dataSolicitacao: "2024-06-01" };
        const resultado = calcularStatus(pedido);
        if (resultado.status !== "Não Entregue") throw new Error("Status deveria ser 'Não Entregue'.");
        if (resultado.dias < 0) throw new Error("Dias não deveria ser negativo.");
    });

    testar("Calcular status para entrega fora do prazo (>5 dias).", () => {
        const pedido = { dataSolicitacao: "2024-06-01", dataEntrega: "2024-06-10" };
        const resultado = calcularStatus(pedido);
        if (resultado.status !== "Entregue Fora do Prazo") throw new Error("Status errado para entrega fora do prazo.");
    });

    testar("Salvar e relacionar os pedidos.", () => {
        const teste = [{ id: 1, numeroCartao: "999", dataSolicitacao: "2024-06-01" }];
        salvarPedidos(teste);
        const resultado = carregarPedidos();
        if (resultado.length !== 1 || resultado[0].id !== 1) throw new Error("Erro ao salvar/relacionar o pedido.");
    });

    testar("Remover pedido e verificar se foi removido da lista.", () => {
        const pedidosTeste = [
            { id: 1, numeroCartao: "111", dataSolicitacao: "2024-06-01" },
            { id: 2, numeroCartao: "222", dataSolicitacao: "2024-06-02" },
        ];
        salvarPedidos(pedidosTeste);
        removerPedido(1);
        const pedidosAtualizados = carregarPedidos();
        if (pedidosAtualizados.find(p => p.id === 1)) throw new Error("Pedido não foi removido.");
        if (pedidosAtualizados.length !== 1) throw new Error("Quantidade incorreta após remoção.");
    });

    testar("Exportar CSV gera conteúdo correto.", () => {
        const pedidosTeste = [
            {
                id: 1,
                numeroCartao: "111",
                tipoCartao: "débito",
                fabricante: "Fabricante X",
                dataSolicitacao: "2024-06-01",
                dataEntrega: "2024-06-03",
            }
        ];
        salvarPedidos(pedidosTeste);

        const headers = ['ID', 'Nº do Cartão', 'Tipo do Cartão', 'Fabricante', 'Data da Solicitação', 'Data da Entrega', 'Status', 'Dias'];
        const rows = pedidosTeste.map(p => {
            const { status, dias } = calcularStatus(p);
            return [
                p.id,
                p.numeroCartao,
                p.tipoCartao,
                p.fabricante,
                p.dataSolicitacao,
                p.dataEntrega || '',
                status,
                dias
            ];
        });

        let csvContent = headers.join(';') + '\n';
        rows.forEach(row => {
            csvContent += row.join(';') + '\n';
        });

        if (!csvContent.includes("ID;Nº do Cartão")) throw new Error("CSV não contém cabeçalho.");
        if (!csvContent.includes("111")) throw new Error("CSV não contém dados do pedido.");
    });
}
