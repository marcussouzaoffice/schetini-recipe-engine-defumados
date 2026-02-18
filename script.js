/*********************************
 CONTROLE DE TELAS
*********************************/
let telaAtual = 0;
const slider = document.querySelector('.slider');

function nextScreen() {
  telaAtual++;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function irInicio() {
  telaAtual = 0;
  slider.style.transform = `translateX(0)`;
}

function novaReceita() {
  telaAtual = 2;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function voltar() {
  telaAtual--;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

/*********************************
 FUNÇÃO FORMATAR
*********************************/
function formatarGramas(valor) {
  return valor.toFixed(2) + " g";
}

/*********************************
 GERAR RECEITA
*********************************/
function gerarReceita() {

  const tipo = document.getElementById("tipoProduto").value;
  const pesoKg = parseFloat(document.getElementById("peso").value);
  const responsavel = document.getElementById("responsavel").value;

  if (!tipo || !pesoKg || pesoKg <= 0) {
    alert("Preencha corretamente.");
    return;
  }

  nextScreen(); // loading

  setTimeout(() => {

    let totalGramas = pesoKg * 1000;
    let html = `<h3>${tipo.toUpperCase()} (${pesoKg} kg)</h3>
    <table>
    <tr><th>Ingrediente</th><th>Quantidade</th></tr>`;

    function add(nome, valorPorKg) {
      const qtd = valorPorKg * pesoKg;
      totalGramas += qtd;
      html += `<tr><td>${nome}</td><td class="qtd">${formatarGramas(qtd)}</td></tr>`;
    }

    if (tipo === "panceta") {

      add("Sal", 2);
      add("Cura", 0.25);
      add("Açúcar mascavo", 0.5);
      add("Pimenta calabresa", 0.1);

      const newCor = (totalGramas / 1000) * 2.5;
      totalGramas += newCor;
      html += `<tr><td>New Cor</td><td class="qtd">${formatarGramas(newCor)}</td></tr>`;

    }

    if (tipo === "copa") {

      add("Sal", 2.5);
      add("Cura", 0.25);
      add("Pimenta do reino", 0.2);
      add("Açúcar demerara", 0.5);
      add("Salsa desidratada", 0.15);
      add("Alho em pó", 0.15);

      const newItem = (totalGramas / 1000) * 0.25;
      totalGramas += newItem;
      html += `<tr><td>New</td><td class="qtd">${formatarGramas(newItem)}</td></tr>`;

    }

    if (tipo === "frango") {

      add("Pimenta do reino", 0.4);
      add("Sal", 4);
      add("Cura", 0.25);
      add("Açúcar mascavo", 3);

    }

    if (tipo === "relish") {

      const fator = (pesoKg * 1000) / 900;

      html += `<tr><th colspan="2">ETAPA 1</th></tr>`;
      html += `<tr><td>Sal</td><td class="qtd">${formatarGramas(35 * fator)}</td></tr>`;
      html += `<tr><td>Cebola</td><td class="qtd">${formatarGramas(125 * fator)}</td></tr>`;
      html += `<tr><td>Pimenta dedo de moça</td><td class="qtd">${formatarGramas(10 * fator)}</td></tr>`;

      html += `<tr><th colspan="2">ETAPA 2</th></tr>`;
      html += `<tr><td>Açúcar</td><td class="qtd">${formatarGramas(280 * fator)}</td></tr>`;
      html += `<tr><td>Vinagre de maçã</td><td class="qtd">${(300 * fator).toFixed(2)} ml</td></tr>`;
      html += `<tr><td>Alho</td><td class="qtd">${formatarGramas(4 * fator)}</td></tr>`;
      html += `<tr><td>Açafrão</td><td class="qtd">Proporcional</td></tr>`;
      html += `<tr><td>Coentro em grão</td><td class="qtd">Proporcional</td></tr>`;
      html += `<tr><td>Mostarda em grão</td><td class="qtd">Proporcional</td></tr>`;

      totalGramas = pesoKg * 1000;

    }

    html += `
      <tr>
        <th>Peso total estimado</th>
        <th>${(totalGramas/1000).toFixed(2)} kg</th>
      </tr>
    </table>`;

    document.getElementById("resultado").innerHTML = html;

    salvarHistorico({
      responsavel,
      tipo,
      pesoKg,
      data: new Date().toLocaleString(),
      receitaHTML: html
    });

    nextScreen();

  }, 1500);
}

/*********************************
 HISTÓRICO
*********************************/
function salvarHistorico(dados) {
  const historico = JSON.parse(localStorage.getItem("historicoDefumados")) || [];
  historico.push(dados);
  localStorage.setItem("historicoDefumados", JSON.stringify(historico));
}

function abrirHistorico() {
  montarHistorico();
  nextScreen();
}

function montarHistorico() {
  const lista = document.getElementById("listaHistorico");
  const historico = JSON.parse(localStorage.getItem("historicoDefumados")) || [];

  if (historico.length === 0) {
    lista.innerHTML = "<p>Nenhuma receita registrada.</p>";
    return;
  }

  let html = "";

  historico.slice().reverse().forEach((item, index) => {
    html += `
      <div class="card-historico">
        <strong>${item.tipo.toUpperCase()}</strong><br>
        ${item.pesoKg} kg<br>
        <small>${item.data}</small><br>
        <em>${item.responsavel}</em><br><br>
        <button class="btn mini" onclick="verReceita(${historico.length - 1 - index})">
          Ver Receita
        </button>
      </div>
    `;
  });

  lista.innerHTML = html;
}

function verReceita(index) {
  const historico = JSON.parse(localStorage.getItem("historicoDefumados")) || [];
  document.getElementById("resultado").innerHTML = historico[index].receitaHTML;
  telaAtual = 4;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}
