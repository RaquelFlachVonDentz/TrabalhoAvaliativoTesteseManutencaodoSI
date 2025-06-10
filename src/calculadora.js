// Função para validar se entrega é >= solicitação
function validarDatas(dataSolicitacao, dataEntrega) {
  if (!dataEntrega) return true; // entrega opcional
  return new Date(dataEntrega) >= new Date(dataSolicitacao);
}

// Função para calcular status, classe e dias
function calcularStatus(pedido) {
  const hoje = new Date();
  const dataSolicitacao = new Date(pedido.dataSolicitacao);
  let status, classe, dias;

  if (pedido.dataEntrega) {
    const dataEntrega = new Date(pedido.dataEntrega);
    dias = Math.ceil((dataEntrega - dataSolicitacao) / (1000 * 60 * 60 * 24));
    if (dias <= 5) {
      status = 'Entregue no Prazo';
      classe = 'entregue';
    } else {
      status = 'Entregue Fora do Prazo';
      classe = 'fora-prazo';
    }
  } else {
    dias = Math.ceil((hoje - dataSolicitacao) / (1000 * 60 * 60 * 24));
    status = 'Não Entregue';
    classe = 'nao-entregue';
  }

  return { status, classe, dias };
}

// Salvar pedidos no localStorage
function salvarPedidos(pedidos) {
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Carregar pedidos do localStorage
function carregarPedidos() {
  const pedidos = JSON.parse(localStorage.getItem('pedidos'));
  return pedidos ? pedidos : [];
}

// Atualizar tabela com lista de pedidos
function atualizarTabela() {
  const pedidos = carregarPedidos();
  const tbody = document.querySelector('#tabela-relatorio tbody');
  tbody.innerHTML = '';

  pedidos.forEach(pedido => {
    const { status, classe, dias } = calcularStatus(pedido);
    const tr = document.createElement('tr');
    tr.className = classe;

    tr.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.numeroCartao}</td>
      <td>${pedido.tipoCartao}</td>
      <td>${pedido.fabricante}</td>
      <td>${pedido.dataSolicitacao}</td>
      <td>${pedido.dataEntrega || '—'}</td>
      <td>${status}</td>
      <td>${dias}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-remover" data-id="${pedido.id}">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Remover pedido por ID
function removerPedido(id) {
  let pedidos = carregarPedidos();
  pedidos = pedidos.filter(p => p.id !== id);
  salvarPedidos(pedidos);
  atualizarTabela();
}

// Exportar tabela para CSV
function exportarCSV() {
  const pedidos = carregarPedidos();
  if (pedidos.length === 0) {
    alert('Não há pedidos para exportar.');
    return;
  }

  const headers = ['ID', 'Nº do Cartão', 'Tipo do Cartão', 'Fabricante', 'Data da Solicitação', 'Data da Entrega', 'Status', 'Dias'];
  const rows = pedidos.map(p => {
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

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio_entregas.csv';
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarTabela();

  // Formulário
  const form = document.getElementById('formulario-pedido');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação bootstrap
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const numeroCartao = document.getElementById('numeroCartao').value.trim();
    const tipoCartao = document.getElementById('tipoCartao').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();
    const dataSolicitacao = document.getElementById('dataSolicitacao').value;
    const dataEntrega = document.getElementById('dataEntrega').value || null;

    // Validação datas
    if (!validarDatas(dataSolicitacao, dataEntrega)) {
      document.getElementById('dataEntrega').classList.add('is-invalid');
      return;
    } else {
      document.getElementById('dataEntrega').classList.remove('is-invalid');
    }

    const novoPedido = {
      id: Date.now(),
      numeroCartao,
      tipoCartao,
      fabricante,
      dataSolicitacao,
      dataEntrega
    };

    const pedidos = carregarPedidos();
    pedidos.push(novoPedido);
    salvarPedidos(pedidos);
    atualizarTabela();

    form.reset();
    form.classList.remove('was-validated');
  });

  // Delegação para botão remover
  document.querySelector('#tabela-relatorio tbody').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remover')) {
      const id = Number(e.target.dataset.id);
      if (confirm('Confirma remoção do pedido?')) {
        removerPedido(id);
      }
    }
  });

  // Exportar CSV
  document.getElementById('btn-exportar').addEventListener('click', exportarCSV);
});