/*
    DADOS DE TESTE (TEMPORÁRIO)

    Simula o que o banco de dados SQL Server vai devolver.
    Quando o servidor estiver pronto, este arquivo deixa de existir
    e as funções de consulta no fim dele passam a buscar os dados na API.

    Contas de teste (senha 1234):
    cliente@teste.com | vendedor@teste.com | admin@teste.com | vendedor2@teste.com
*/

const USUARIOS = [
    { id: 1, tipo: "cliente", nome: "Cliente Teste", email: "cliente@teste.com", senha: "1234", endereco: "Rua das Flores, 120 - Centro, Vitória/ES" },
    { id: 2, tipo: "vendedor", nome: "Vendedor Teste", email: "vendedor@teste.com", senha: "1234", lojaId: 1 },
    { id: 3, tipo: "administrador", nome: "Administrador Teste", email: "admin@teste.com", senha: "1234" },
    { id: 4, tipo: "vendedor", nome: "Outro Vendedor", email: "vendedor2@teste.com", senha: "1234", lojaId: 2 }
];

const LOJAS = [
    { id: 1, nome: "Frio Total Climatização", cidade: "Vitória", estado: "ES", regiao: "Sudeste", telefone: "(27) 3000-0001", email: "contato@friototal.com.br", endereco: "Av. Principal, 100 - Centro" },
    { id: 2, nome: "Clima Norte", cidade: "Belém", estado: "PA", regiao: "Norte", telefone: "(91) 3000-0002", email: "contato@climanorte.com.br", endereco: "Rua das Palmeiras, 250 - Nazaré" }
];

const TIPOS = {
    "ar-condicionado": "Ar-condicionado",
    "climatizador": "Climatizador",
    "acessorio": "Acessório",
    "peca": "Peça de reposição"
};

const SIGLAS = { "ar-condicionado": "AC", "climatizador": "CL", "acessorio": "AX", "peca": "PC" };

/* CATÁLOGO DA CENTRAL DE AR (produtos-base, iguais para todos os vendedores) */
const CATALOGO = [
    { id: 1, nome: "Ar-Condicionado Split Inverter 9.000 BTUs Frio", marca: "LG", modelo: "S4-Q09", tipo: "ar-condicionado", precoFabrica: 1800, situacao: "ativo",
      descricao: "Split Inverter ideal para quartos pequenos, com economia de energia e funcionamento silencioso.",
      caracteristicas: [["Capacidade", "9.000 BTUs"], ["Ciclo", "Somente frio"], ["Tecnologia", "Inverter"], ["Tensão", "220 V"]] },
    { id: 2, nome: "Ar-Condicionado WindFree 12.000 BTUs Quente/Frio", marca: "Samsung", modelo: "WF-12", tipo: "ar-condicionado", precoFabrica: 2400, situacao: "ativo",
      descricao: "Climatização sem corrente de ar direta, para salas e quartos médios.",
      caracteristicas: [["Capacidade", "12.000 BTUs"], ["Ciclo", "Quente e frio"], ["Tecnologia", "Inverter"], ["Tensão", "220 V"]] },
    { id: 3, nome: "Ar-Condicionado Split Inverter 18.000 BTUs Frio", marca: "Daikin", modelo: "DK-18", tipo: "ar-condicionado", precoFabrica: 3300, situacao: "ativo",
      descricao: "Split Inverter para ambientes amplos e comerciais.",
      caracteristicas: [["Capacidade", "18.000 BTUs"], ["Ciclo", "Somente frio"], ["Tecnologia", "Inverter"], ["Tensão", "220 V"]] },
    { id: 4, nome: "Climatizador Evaporativo 40 L", marca: "Central de Ar", modelo: "CL-40", tipo: "climatizador", precoFabrica: 650, situacao: "ativo",
      descricao: "Climatizador evaporativo portátil com reservatório de 40 litros.",
      caracteristicas: [["Reservatório", "40 L"], ["Tensão", "127 V"], ["Tipo", "Portátil"]] },
    { id: 5, nome: "Suporte Universal para Condensadora", marca: "Central de Ar", modelo: "SU-01", tipo: "acessorio", precoFabrica: 45, situacao: "ativo",
      descricao: "Suporte de aço para instalação de condensadoras de até 36.000 BTUs.",
      caracteristicas: [["Categoria", "Suporte"], ["Material", "Aço galvanizado"], ["Compatibilidade", "Até 36.000 BTUs"]] },
    { id: 6, nome: "Ar-Condicionado Split Hi-Wall 7.500 BTUs", marca: "LG", modelo: "HW-75", tipo: "ar-condicionado", precoFabrica: 1500, situacao: "descontinuado",
      descricao: "Modelo fora de fabricação.",
      caracteristicas: [["Capacidade", "7.500 BTUs"], ["Ciclo", "Somente frio"]] }
];

/* OFERTAS: produto do catálogo vendido por uma loja (preço e estoque são de cada vendedor) */
const OFERTAS = [
    { id: 1, catalogoId: 1, lojaId: 1, preco: 2124.15, precoAntigo: 2499, validade: "31/12/2026", estoque: 12, situacao: "ativo" },
    { id: 2, catalogoId: 2, lojaId: 2, preco: 2969.10, precoAntigo: 3299, validade: "30/11/2026", estoque: 8, situacao: "ativo" },
    { id: 3, catalogoId: 3, lojaId: 1, preco: 4199, precoAntigo: null, validade: null, estoque: 5, situacao: "ativo" }
];


/* FUNÇÕES DE CONSULTA (no futuro, viram chamadas ao servidor) */

function buscarLoja(id) {
    return LOJAS.find(l => l.id === Number(id)) || null;
}

function buscarOferta(id) {
    const oferta = OFERTAS.find(o => o.id === Number(id));
    if (!oferta) return null;

    const produto = CATALOGO.find(c => c.id === oferta.catalogoId);
    return { ...produto, ...oferta, loja: buscarLoja(oferta.lojaId) };
}

function ofertasDaLoja(lojaId) {
    return OFERTAS.filter(o => o.lojaId === Number(lojaId)).map(o => buscarOferta(o.id));
}
