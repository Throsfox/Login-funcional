/*
    SESSÃO E PERMISSÕES (TEMPORÁRIO)

    Faz as páginas saberem quem entrou e o que cada tipo de usuário pode ver.
    Usa o sessionStorage do navegador para lembrar o usuário durante o teste.
    Com o servidor pronto, o login passa a ser feito na API, e a verificação
    de permissão também precisa existir no servidor (esconder algo na tela
    não impede ninguém de acessar).

    Este arquivo é carregado no <head> de todas as páginas, antes dos outros scripts.
*/

const PAGINAS_PUBLICAS = ["index", "cadastrar"];
const PAGINAS_CLIENTE = ["cliente", "produto", "loja", "meusPedidos"];

const ACESSO = {
    cliente: PAGINAS_CLIENTE,
    vendedor: [...PAGINAS_CLIENTE, "vendedor", "pedidos", "empresa", "anunciarProduto"],
    administrador: [...PAGINAS_CLIENTE, "empresa", "novoProduto"]
};

/* Todos os usuários começam na página com os produtos da empresa */
const PAGINA_INICIAL = {
    cliente: "cliente.html",
    vendedor: "cliente.html",
    administrador: "cliente.html"
};

const ROTULO_TIPO = {
    cliente: "Cliente",
    vendedor: "Vendedor parceiro",
    administrador: "Administrador"
};


/* LOGIN E LOGOUT */

function usuarioLogado() {
    try {
        return JSON.parse(sessionStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}

function fazerLogin(email, senha) {
    const usuario = USUARIOS.find(u => u.email === email && u.senha === senha);
    if (!usuario) return null;

    const { senha: senhaDescartada, ...sessao } = usuario;
    sessionStorage.setItem("usuarioLogado", JSON.stringify(sessao));
    return sessao;
}

function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}


/* VERIFICAÇÃO DE ACESSO (roda assim que a página começa a carregar) */

const PAGINA = window.location.pathname.split("/").pop().replace(".html", "") || "index";
const USUARIO = usuarioLogado();
const PERMITIDO = PAGINAS_PUBLICAS.includes(PAGINA) ||
    (USUARIO !== null && ACESSO[USUARIO.tipo] !== undefined && ACESSO[USUARIO.tipo].includes(PAGINA));

if (!PERMITIDO) {
    document.documentElement.style.visibility = "hidden";
    window.location.replace(USUARIO ? PAGINA_INICIAL[USUARIO.tipo] : "index.html");
}


/* UTILIDADES USADAS PELAS PÁGINAS */

function escrever(seletor, texto) {
    document.querySelectorAll(seletor).forEach(e => e.textContent = texto);
}

function reais(valor) {
    return "R$ " + Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function desconto(oferta) {
    return oferta.precoAntigo ? Math.round((1 - oferta.preco / oferta.precoAntigo) * 100) : 0;
}

function parametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}


/* AJUSTES COMUNS A TODAS AS PÁGINAS */

document.addEventListener("DOMContentLoaded", function () {
    if (!PERMITIDO || !USUARIO) return;

    // Identificação no cabeçalho e no menu lateral
    const loja = USUARIO.lojaId ? buscarLoja(USUARIO.lojaId) : null;
    const conta = loja ? loja.nome : "Central de ar LTDA";

    escrever(".dadosVendedor strong", USUARIO.nome);
    escrever(".dadosVendedor span", ROTULO_TIPO[USUARIO.tipo]);
    escrever(".identificacaoLoja h3", conta);
    escrever(".identificacaoLoja p", loja ? loja.cidade + "/" + loja.estado + " · " + loja.regiao : ROTULO_TIPO[USUARIO.tipo]);
    escrever(".iconeLoja", conta.charAt(0));

    // Ícone de pessoa (barra das páginas de cliente): vendedor vai para a sua loja, administrador para o catálogo
    const iconeConta = document.getElementById("UsuConta");
    const linkConta = iconeConta ? iconeConta.closest("a") : null;

    if (linkConta && USUARIO.tipo === "vendedor") {
        linkConta.href = "loja.html?id=" + USUARIO.lojaId;
        linkConta.title = "Minha loja";
    } else if (linkConta && USUARIO.tipo === "administrador") {
        linkConta.href = "empresa.html";
        linkConta.title = "Catálogo";
    }

    // Esconde o que não é do tipo de usuário atual
    [["somenteVendedor", "vendedor"], ["somenteAdmin", "administrador"]].forEach(function (par) {
        if (USUARIO.tipo !== par[1]) {
            document.querySelectorAll("." + par[0]).forEach(e => e.style.display = "none");
        }
    });

    // Lista vazia de pedidos
    const semPedidos = document.getElementById("semPedidos");
    if (semPedidos && !document.querySelector("#TabelaPedidos tbody tr")) {
        semPedidos.hidden = false;
    }
});

document.addEventListener("click", function (evento) {
    if (evento.target.closest(".linkSair")) {
        evento.preventDefault();
        sair();
    }

    if (evento.target.closest("[data-pendente]")) {
        evento.preventDefault();
        alert("Esta ação ainda não está conectada ao banco de dados.");
    }
});
