// ==========================================
// DRIVEID - SCRIPT DE GESTÃO DE VEÍCULOS (SPRINT 2)
// ==========================================

const STORAGE_KEY = '@DriveID:veiculos';

document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    const formVeiculo = document.getElementById('form-veiculo');
    
    if (formVeiculo) {
        formVeiculo.addEventListener('submit', cadastrarVeiculo);
    }

    renderizarTabelaVeiculos();
}

// 1. VALIDAÇÃO DE PLACA (Antiga e Mercosul)
function validarPlacaBrasil(placa) {
    const placaLimpa = placa.trim().toUpperCase();
    
    const regexPlacaAntiga = /^[A-Z]{3}-[0-9]{4}$/;
    const regexPlacaMercosul = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    const regexPlacaAntigaSemHifen = /^[A-Z]{3}[0-9]{4}$/;

    return regexPlacaAntiga.test(placaLimpa) || 
           regexPlacaMercosul.test(placaLimpa) || 
           regexPlacaAntigaSemHifen.test(placaLimpa);
}

// 2. OPERAÇÕES DE CRUD (localStorage)
function obterVeiculos() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarVeiculos(veiculos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(veiculos));
}

function cadastrarVeiculo(event) {
    event.preventDefault();

    const inputPlaca = document.getElementById('placa');
    const inputModelo = document.getElementById('modelo');
    const inputCor = document.getElementById('cor');

    const placa = inputPlaca.value.trim().toUpperCase();
    const modelo = inputModelo.value.trim();
    const cor = inputCor.value.trim();

    if (!placa || !modelo || !cor) {
        alert('Por favor, preencha todos os campos do veículo.');
        return;
    }

    if (!validarPlacaBrasil(placa)) {
        alert('Formato de placa inválido! Utilize o padrão antigo (ABC-1234) ou Mercosul (ABC1D23).');
        inputPlaca.focus();
        return;
    }

    const veiculos = obterVeiculos();

    const veiculoExistente = veiculos.find(v => v.placa === placa);
    if (veiculoExistente) {
        alert('Esta placa já se encontra registada no sistema.');
        return;
    }

    const novoVeiculo = {
        id: Date.now().toString(),
        placa,
        modelo,
        cor,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    veiculos.push(novoVeiculo);
    salvarVeiculos(veiculos);

    event.target.reset();
    renderizarTabelaVeiculos();
    
    alert('Veículo cadastrado com sucesso!');
}

function excluirVeiculo(id) {
    if (confirm('Tem certeza de que deseja remover este veículo?')) {
        let veiculos = obterVeiculos();
        veiculos = veiculos.filter(v => v.id !== id);
        salvarVeiculos(veiculos);
        renderizarTabelaVeiculos();
    }
}

// 3. RENDERIZAÇÃO DINÂMICA NO DOM
function renderizarTabelaVeiculos() {
    const tbody = document.getElementById('lista-veiculos');
    
    if (!tbody) return;

    const veiculos = obterVeiculos();
    tbody.innerHTML = '';

    if (veiculos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-warning py-3">Nenhum veículo registado até ao momento.</td></tr>`;
        return;
    }

    veiculos.forEach((veiculo, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${veiculo.placa}</strong></td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.cor}</td>
            <td>
                <button class="btn btn-sm btn-danger px-3" onclick="excluirVeiculo('${veiculo.id}')">Excluir</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}