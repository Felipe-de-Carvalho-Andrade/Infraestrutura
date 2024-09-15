// Função para coletar valores e gerar as planilhas
function calcular() {
    if (!validarRespostas()) {
        return;
    }

    // Captura dos valores condicionais - Malha Horizontal
    const pontosTelecomSim = document.querySelector('input[name="pontosTelecom"]:checked')?.value === 'sim';
    const numPontosTelecom = pontosTelecomSim ? parseInt(document.getElementById('numPontosTelecom').value) || 0 : 0;
    const pontosRedeSim = document.querySelector('input[name="pontosRede"]:checked')?.value === 'sim';
    const numPontosRede = pontosRedeSim ? parseInt(document.getElementById('numPontosRede').value) || 0 : 0;
    const voipSim = document.querySelector('input[name="voip"]:checked')?.value === 'sim';
    const numVoip = voipSim ? parseInt(document.getElementById('numVoip').value) || 0 : 0;
    const cftvSim = document.querySelector('input[name="cftv"]:checked')?.value === 'sim';
    const numCftv = cftvSim ? parseInt(document.getElementById('numCftv').value) || 0 : 0;
    
    // Captura dos valores condicionais - Backbone
    const backbonePrimarioSim = document.querySelector('input[name="BackbonePrimario"]:checked')?.value === 'sim';
    const numBackbonePrimario = backbonePrimarioSim ? parseInt(document.getElementById('numBackbonePrimario').value) || 0 : 0;
    const backboneSecundarioSim = document.querySelector('input[name="BackboneSecundario"]:checked')?.value === 'sim';
    const numBackboneSecundario = backboneSecundarioSim ? parseInt(document.getElementById('numBackboneSecundario').value) || 0 : 0;

    // Valores do Backbone
    const numPavimentosBackbone = parseInt(document.getElementById('numPavimentosBackbone').value) || 0;
    const paresFibras = parseInt(document.getElementById('paresFibras').value) || 0;
    const medidaBB = parseFloat(document.getElementById('medidaBB').value) || 0;
    const especificacaoCabo = document.getElementById('especificacaoCabo').value;
    const caracteristicaFibra = document.getElementById('caracteristicaFibra').value;
    const qtdBackbones = parseInt(document.getElementById('quantidadeBackbones').value) || 0;
    
    // Valores da Malha Horizontal
    const numPavimentosMH = parseInt(document.getElementById('numPavimentosMH').value) || 0;
    const medidaMH = parseFloat(document.getElementById('medidaMH').value) || 0;
    const especificacaoCategoria = document.getElementById('especificacaoCategoria').value || '6';
    const voip = document.querySelector('input[name="voip"]:checked')?.value;
    const cftv = document.querySelector('input[name="cftv"]:checked')?.value;
    const tipoRack = document.querySelector('input[name="tipoRack"]:checked')?.value || "Fechado";

        // ÁREA DE TRABALHO
        const qtdTotalTomadasAndar = ((numPontosTelecom * 2) + numCftv + numPontosRede);
        const qtdTotalTomadas = (qtdTotalTomadasAndar * numPavimentosMH);
        const qtdEtqIdentificacaoTE = qtdTotalTomadas  + ((numPontosTelecom + numPontosRede + numCftv) * numPavimentosMH);
        
        // MALHA HORIZONTAL
        const qtdEtqIdentificacaoMH = qtdTotalTomadas * 2;
        
        // SALA DE EQUIPAMENTOS/TELECOM (SEQ/SET)
        const qtdPPMHAndar = Math.ceil(qtdTotalTomadasAndar / 24);
        const qtdPPMH = qtdPPMHAndar * numPavimentosMH;
        const qtdPatchCableAzul = ((numPontosTelecom * 2) + numPontosRede - numVoip) * numPavimentosMH;
        const qtdPatchCableAmarelo = (voip === 'sim') ? numPavimentosMH * numVoip : 0;
        const qtdPatchCableVermelho = (cftv === 'sim') ? numPavimentosMH * numCftv : 0;
        const qtdNVR = Math.ceil(qtdPatchCableVermelho / 24);

        // MISCELÂNEA

 
    let planilhaMH = '';
    let planilhaBackbone = '';
    
    // Geração da planilha de Malha Horizontal
    if (numPavimentosMH > 0 && (pontosTelecomSim || pontosRedeSim)) {
        const infoRack = calcularRack(qtdPPMH, numPavimentosMH);

        planilhaMH += `<h3>Planilha de Malha Horizontal</h3>`;
        planilhaMH += `<table>
            <thead>
                <tr><th>Tipo de Equip.</th><th>Descrição</th><th>Unidade</th><th>Qtd. Total</th></tr>
            </thead>
            <tbody>
                <tr><td>Área de Trabalho</td><td>Tomada RJ 45 Fêmea (categoria ${especificacaoCategoria})</td><td>Unid.</td><td>${qtdTotalTomadas}</td></tr>
                <tr><td>Área de Trabalho</td><td>Cordão de ligação (Patch Cord), (categoria ${especificacaoCategoria}), (Tamanho 3 m), (cor: azul)</td><td>Unid.</td><td>${qtdPatchCableAzul + qtdPatchCableAmarelo}</td></tr>
                ${qtdPatchCableVermelho > 0 ? `<tr><td>Área de Trabalho</td><td>Cordão de ligação (Patch Cord), (categoria ${especificacaoCategoria}), (Tamanho 3 m), (cor: [cor do teto])</td><td>Unid.</td><td>${qtdPatchCableVermelho}</td></tr>` : ''}
                ${numPontosTelecom > 0 ? `<tr><td>Área de Trabalho</td><td>Espelho de conexão (Tamanho 4x4)</td><td>Unid.</td><td>${numPontosTelecom * numPavimentosMH}</td></tr>` : ``}
                ${numPontosRede + numCftv + numVoip > 0 ? `<tr><td>Área de Trabalho</td><td>Espelho de conexão (Tamanho 2x4)</td><td>Unid.</td><td>${(numPontosRede + numCftv) * numPavimentosMH}</td></tr>` : ``}
                <tr><td>Cabeamento Horizontal</td><td>Cabo UTP rígido (categoria ${especificacaoCategoria}) (azul)</td><td>Cx´s</td><td>${Math.ceil((qtdTotalTomadas * medidaMH) / 305)}</td></tr>
                <tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Patch Panel de Malha Horizontal, (Categoria ${especificacaoCategoria}), (24 portas), (Altura: 1U)</td><td>Unid.</td><td>${qtdPPMH}</td></tr>
                <tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Cordão de Ligação, flexível, (Patch Cable), (categoria ${especificacaoCategoria}), (Tamanho: 2m), (cor: azul)</td><td>Unid.</td><td>${qtdPatchCableAzul}</td></tr>
                ${qtdPatchCableAmarelo > 0 ? `<tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Cordão de Ligação, flexível, (Patch Cable), (categoria ${especificacaoCategoria}), (Tamanho: 2m), (cor: amarelo)</td><td>Unid.</td><td>${qtdPatchCableAmarelo}</td></tr>` : ''}
                ${qtdPatchCableVermelho > 0 ? `<tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Cordão de Ligação, flexível, (Patch Cable), (categoria ${especificacaoCategoria}), (Tamanho: 2m), (cor: vermelho)</td><td>Unid.</td><td>${qtdPatchCableVermelho}</td></tr>` : ''}
                <tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Rack (${tipoRack}), (Tamanho total: = ${infoRack.tamanhoRack}U)</td><td>Unid.</td><td>${infoRack.quantidadeRacks}</td></tr>
                ${tipoRack === 'Aberto' ? `<tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Organizador lateral para Rack ${infoRack.tamanhoRack}U</td><td>Unid.</td><td>${infoRack.quantidadeRacks * 2}</td></tr>` : ``}
                <tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Bandeja fixa - 19" de largura (1U de bandeja + 3U de espaço)</td><td>Unid.</td><td>${infoRack.quantidadeRacks}</td></tr>
                ${cftvSim ? `<tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Bandeja deslizante - 19" de largura</td><td>Unid.</td><td>${qtdNVR}</td></tr>` : ``}
                <tr><td>Sala de Equipamentos/Telecom (SEQ/SET)</td><td>Parafuso Porca Gaiola (conjunto com 10 unidades)</td><td>Conj.</td><td>${infoRack.tamanhoRack * 4}</td></tr>
                <tr><td>Miscelânea</td><td>Abraçadeira de velcro</td><td>m</td><td>${infoRack.quantidadeRacks * 3}</td></tr>
                <tr><td>Miscelânea</td><td>Abraçadeira Hellermann (conjunto com 100 unidades)</td><td>Conj.</td><td>${infoRack.quantidadeRacks}</td></tr>
                <tr><td>Miscelânea</td><td>Filtro de linha com 08 tomadas</td><td>Unid.</td><td>${infoRack.quantidadeRacks * 2}</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para identificação de tomadas e espelho</td><td>Unid.</td><td>${qtdEtqIdentificacaoTE}</td></tr>
                <tr><td>Miscelânea</td><td>Etiqueta identificação do cabo de malha horizontal</td><td>Unid.</td><td>${qtdEtqIdentificacaoMH}</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para Rack</td><td>Unid.</td><td>${infoRack.quantidadeRacks}</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para Painel de Telecomunicações</td><td>Unid.</td><td>${qtdPPMH}</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para identificação de portas do Patch Panel</td><td>Unid.</td><td>${qtdPPMH * 24}</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para identificação dos Patch Cables</td><td>Unid.</td><td>${(qtdPatchCableAmarelo + qtdPatchCableAzul + qtdPatchCableVermelho) * 2}</td></tr>
            </tbody>
        </table>`;
    }

    // Geração da planilha de Backbone
    if (numPavimentosBackbone > 0 && (backbonePrimarioSim || backboneSecundarioSim)) {
        planilhaBackbone += `<h3>Planilha de Backbone</h3>`;
        planilhaBackbone += `<table>
            <thead>
                <tr><th>Tipo de Equip.</th><th>Descrição</th><th>Unidade</th><th>Qtd. Total</th></tr>
            </thead>
            <tbody>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Distribuidor óptico (DIO) - chassi com 19" de largura e 1U de altura com 24 portas</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Caixa de emenda (${paresFibras} fibras)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Bandeija de emenda (${paresFibras} fibras)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Protetores de emenda</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>PigTail (especificação da fibra, núcleo e casca), (tipo de conector), (2m), (cor)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Acoplador óptico (especificação da fibra, núcleo e casca), (tipo de conector), (cor)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Cordão óptico (especificação da fibra, núcleo e casca), (duplo), (tipo de conector), (2m), (cor)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Terminador Óptico (2, 4, 6 ou 8 fibras)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Cabo Óptico (MM ou SM), (núcleo e casca), (Loose ou Tight Buffer), (${paresFibras} fibras)</td><td>m</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Rack (Aberto), Tamanho: XXU)</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Bandeja fixa - 19" de largura</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Bandeja deslizante - 19" de largura</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Sala de Equipamentos/Telecom - Backbone</td><td>Parafuso Porca Gaiola (conjunto com 10 unidades)</td><td>Conj.</td><td>1</td></tr>
                <tr><td>Miscelânea</td><td>Abraçadeira de velcro</td><td>m</td><td>1</td></tr>
                <tr><td>Miscelânea</td><td>Abraçadeira Hellermann (conjunto com 100 unidades)</td><td>Conj.</td><td>1</td></tr>
                <tr><td>Miscelânea</td><td>Filtro de linha com 08 tomadas</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para Rack</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para DIO</td><td>Unid.</td><td>1</td></tr>
                <tr><td>Miscelânea</td><td>Etiquetas para identificação dos cordões ópticos e Pigtails externos</td><td>Unid.</td><td>1</td></tr>
            </tbody>
        </table>`;
    }


    // Mostrar o resultado
    const resultadoBackbone = document.getElementById('resultadoBackbone');
    const resultadoMH = document.getElementById('resultadoMH');

    resultadoBackbone.innerHTML = planilhaBackbone.includes('Planilha de Backbone') ? planilhaBackbone : '';
    resultadoMH.innerHTML = planilhaMH;

    document.getElementById('novaPlanilha').style.display = 'inline-block';
}

// Função para validar as respostas obrigatórias
function validarRespostas() {
    // Validar se todas as perguntas obrigatórias foram respondidas
    const backbonePrimario = document.querySelector('input[name="BackbonePrimario"]:checked');
    const backboneSecundario = document.querySelector('input[name="BackboneSecundario"]:checked');
    const pontosTelecom = document.querySelector('input[name="pontosTelecom"]:checked');
    const pontosRede = document.querySelector('input[name="pontosRede"]:checked');

    // Verificar se todas as perguntas obrigatórias foram respondidas
    if (!backbonePrimario) {
        alert("Por favor, responda se há Backbone primário.");
        return false;
    }
    if (!backboneSecundario) {
        alert("Por favor, responda se há Backbone secundário.");
        return false;
    }
    if (!pontosTelecom) {
        alert("Por favor, responda se há pontos de telecom.");
        return false;
    }
    if (!pontosRede) {
        alert("Por favor, responda se há pontos de rede.");
        return false;
    }

    // Verificar se pelo menos uma das perguntas relacionadas ao Backbone, pontos de telecom ou pontos de rede é "Sim"
    const backbonePrimarioSim = backbonePrimario.value === 'sim';
    const backboneSecundarioSim = backboneSecundario.value === 'sim';
    const pontosTelecomSim = pontosTelecom.value === 'sim';
    const pontosRedeSim = pontosRede.value === 'sim';

    if (!backbonePrimarioSim && !backboneSecundarioSim && !pontosTelecomSim && !pontosRedeSim) {
        alert("Não foi possível realizar a quantificação!");
        return false;
    }

    return true;
}

// Função para mostrar ou ocultar campos com base na seleção
function toggleFields(fieldName, show) {
    const fieldsId = {
        'pontosTelecom': 'pontosTelecomFields',
        'pontosRede': 'pontosRedeFields',
        'voip': 'voipFields',
        'cftv': 'cftvFields',
        'backbonePrimario': 'backbonePrimarioFields',
        'backboneSecundario': 'backboneSecundarioFields'
    };

    const fields = document.getElementById(fieldsId[fieldName]);
    if (show) {
        fields.style.display = 'block';
    } else {
        fields.style.display = 'none';
    }
}

// Função para gerar nova planilha
function novaPlanilha() {
    // Limpar todos os campos de entrada
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);

    // Ocultar campos condicionais
    document.querySelectorAll('.hidden-fields').forEach(field => field.style.display = 'none');

    // Ocultar resultados
    document.getElementById('resultadoBackbone').innerHTML = '';
    document.getElementById('resultadoMH').innerHTML = '';

    // Atualizar visibilidade dos botões
    document.getElementById('novaPlanilha').style.display = 'none';
}

// Função para calcular tamanho do Rack e quantidade de Racks
function calcularRack(qtdPPMH, numPavimentos) {
    qtdPPMH /= numPavimentos;
    
    // Calcula o tamanho do rack
    const tamanhoRack = ((qtdPPMH * 2) * 2 + 4) * 1.5;

    // Define os limites e incrementos para o tamanho do rack
    const tamanhoMinimo = 6;
    const tamanhoMaximo = 48;
    const incrementoMenor = 2;
    const incrementoMaior = 4;

    let tamanhoRackValido;
    let quantidadeRacks = 1;

    if (tamanhoRack > tamanhoMaximo) {
        // Se o tamanho exceder o máximo permitido, divida em múltiplos racks
        quantidadeRacks = Math.ceil(tamanhoRack / tamanhoMaximo);
        tamanhoRackValido = tamanhoMaximo;
    } else {
        // Determina o tamanho válido para racks
        if (tamanhoRack <= 12) {
            tamanhoRackValido = Math.max(tamanhoMinimo, Math.ceil(tamanhoRack / incrementoMenor) * incrementoMenor);
        } else {
            tamanhoRackValido = Math.max(12, Math.ceil((tamanhoRack - 12) / incrementoMaior) * incrementoMaior + 12);
        }
        
        quantidadeRacks = 1;
    }

    return {
        tamanhoRack: tamanhoRack,
        quantidadeRacks: quantidadeRacks
    };
}

// Inicializar campos e botões ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    novaPlanilha();
});

// Adicionar eventos aos botões
document.getElementById('calcular').addEventListener('click', calcular);
document.getElementById('novaPlanilha').addEventListener('click', novaPlanilha);