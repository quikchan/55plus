/**************************************************
 @title 55chan +Plus
 @author Scripteiro
 @version 2.4.1
 @description Script de melhorias do chan.
 @URL http://collabedit.com/s6rqv
 @Thread http://55chan.org/comp/res/5667.html
 @sandbox Utilizem o 55chan.org/teste para testes.
 @colaboradores jpsé
 @agradecimentos Abadon, anon408
 ---------------------------------------------------
 Contato
 https://55chan.org/comp/res/5667.html
 ---------------------------------------------------
 Histórico de alterações, seguir o template:       |
 (data) - versão - autor - descrição do que foi feito
 Versionamento:  Arquitetura (Major) / Funcionalidades (Minor) / PATCHES de correção
 ---------------------------------------------------
 10/05/2016 - 1.0.7 - @scripteiro - código publicado.
 10/05/2016 - 1.1.8 - @scripteiro - *Novo* Anti-filtro para posts já publicados.
 10/05/2016 - 1.2.9 - @scripteiro - Anti-V1R0$ (Remove URLs suspeitas)
 10/05/2016 - 1.3.0 - @Jpsé - Melhorias na ordem e leitura do código
 10/05/2016 - 1.4.0 - @scripteiro - Adicionado Xvideos, só vai funcionar se o usuário permitir conexões do xVideos no navegador.
 10/05/2016 - 1.5.0 - @scripteiro - Código refatorado, persistencia de dados e hide de postagens
 10/05/2017 - 1.6.0 - @scripteiro - Auto mutar músicas em autoplay no chan.
 11/05/2016 - 1.7.0 - @Jpsé - Alteração do script de incorporação de vídeo para utilização de json
 11/05/2016 - 1.7.1 - @Jpsé - Adicionado outros players de video para incorporação
 11/05/2016 - 1.8.0 - @Jpsé - Criação de um novo filtro de palavras reverso, com a adição de um json que pode funcionar dos dois lados
 11/05/2016 - 1.8.1 - @Jpsé - Deixar a barra sempre visivel
 11/05/2016 - 1.9.0 - @Jpsé - Novo sistema de filtro de palavras
 11/05/2016 - 1.9.1 - @Jpsé - Adicionado suporte a mp4
 11/05/2016 - 2.0.0 - @Jpsé - Novo sistema de esconder posts e adição de bloqueio de arquivos suspeitos
 11/05/2016 - 2.1.0 - @Jpsé - Aprimoramento do sistema de esconder posts, filtrar palavras e adição do konami code
 12/05/2016 - 2.1.1 - @Jpsé - Correçã de mais bugs
 12/05/2016 - 2.1.2 - @Jpsé - Correçã de mais bugs
 12/05/2016 - 2.2.0 - @Jpsé - Correçã de mais bugs, ajuste na verificação e troca de filtros (acontecem em todos os posts), inclusão do mododilma e IRC
 12/05/2016 - 2.3.0 - @Jpsé - Inserção do link para catálogo direto e correção dos filtros para resposta rápida
 12/05/2016 - 2.3.1 - @scripteiro - https irc
 12/05/2016 - 2.4.0 - @Jpsé - Adicionado suporte a fundir threads
 12/05/2016 - 2.4.1 - @Jpsé - Adição do modoanimu e correção de bugs e requests
 17/05/2016 - 2.5.0 - @Jpsé - Adicionado Fluxo Vivo
 17/05/2016 - 2.5.1 - @Jpsé - Adicionada boards ocultas, correções de bugs no fluxo vivo


 //TODO
 //cache de imagens
 //pesquisar imagens no google
 //Criar Menu personalizado
 //Poder alterar CSS do chan on-demand
 //Usuário pode colocar uma imagem de papel de parede no chan
 //Usuário pode colocar música para tocar no chan
 //Auto arquivar threads no cache da maquina do usuário (não salvar imagens)
 **************************************************/

//<editor-fold desc="Inicialização">
window.top.publicversion = "2.5.1";
/*checarAtualizacao();

 function checarAtualizacao(){
 $.get("https://raw.githubusercontent.com/quikchan/55plus/master/script.js", function(data){
 //ainda nao terminei a conta foi banida, tem que esperar voltar.
 });
 }*/

var log = function (mensagem) {
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();

    if (typeof ativarLog === 'undefined' || ativarLog === true) {
        console.log(hh + ":" + mm + ":" + ss + " - " + mensagem.toString());
    }
};


function testarPai() {
    return typeof window.top.carregadoNoPai !== 'undefined';
}

function checharPaginaEmbutida() {
    if (($('body', window.parent.document).hasClass('home')) && (!testarPai())) {

        var myNewScript = document.createElement('script');
        myNewScript.setAttribute('type', 'text/javascript');
        //noinspection JSUnresolvedVariable
        myNewScript.text = localStorage.user_js;

        window.top.document.getElementsByTagName("head")[0].appendChild(myNewScript);
        window.top.carregadoNoPai = true;
        return true;
    }

    return false;
}

function verificarPluginFilho() {
    window.top.documento = $("iframe[id=main]").contents();

    if (documento.find('body').attr('id') != "55Plus") {
        log('Iniciando 55Plus no filho.');
        documento.find('body').attr('id', '55Plus');
        iniciar55Plus();
    }
}

//Este if é preciso ser feito pois quando estivermos na raíz do site (55chan.org/index.html) ele não executa onload
if (testarPai()) {
    verificarPluginFilho();
    setInterval(window.top.verificarPluginFilho, 1000);
}

$(document).ready(function () {
    if (checharPaginaEmbutida()) {
        log("Carregando script no pai.");
        return true;
    }

    if (testarPai()) {
        log("Script carregado no pai.");
        return true;
    }

    log("Chan +Plus");
    log("Inicializando script");

    iniciar55Plus();
});

function iniciar55Plus() {

    inicializarVariaveisGlobais();
    criarOpcoes();
    alterarCSS();
    inserirBoardsOcultas();

    inserirLinksEsconderPosts();
    lerDados([esconderRespostasAnteriormenteEscondidas, ativarModo, ativarFiltros]);
    setInterval(function () {
        lerDados([ativarModo, incluirEventoFiltroFormulario]);
    }, 1000);

    if (paginaThread()) {
        ativarBaixarTodasAsImagens();
        downloadVideosYoutube();
    }

    setInterval(ativarFiltros, 10000);
    setInterval(adicionarPostsFundidos, 1000);
    setInterval(carregarImagensNoCache, 1000);
    ativarAtalhosTeclado();
    menuReportarPostagem();

    inserirLinkCatalogo();
    criarJanelaIRC();
    criarFundirTopico();
    criarFluxoVivo();
}

function inicializarVariaveisGlobais() {
    window.top.data55Plus = {"modo": "nenhum", "respostasEscondidas": []};

    if (typeof window.top.documento === "undefined") {
        if (typeof window.top.carregadoNoPai != "undefined") {
            window.top.documento = $("iframe[id=main]").contents();
        } else {
            window.top.documento = $(document);
        }
    }

    window.top.ativarLog = true;

    window.top.links = {
        "arquivo": [
            {
                "nome": "Moleque Chutadeiro.mp4",
                "tamanho": "130.74 KB",
                "dimensao": "400x400",
                "motivo": "Áudio da mulher gemedeira"
            },
            {
                "nome": " Dilma Tropeça e Cai na Rampa.mp4",
                "tamanho": "538 KB",
                "dimensao": "1280x720",
                "motivo": "Áudio da mulher gemedeira"
            }
            , {
                "nome": "cats.webm",
                "tamanho": "1.21 MB",
                "dimensao": "1280x720",
                "motivo": "Homem gritadeiro"
            }
            , {
                "nome": "1461045106997.webm",
                "tamanho": "961.33 KB",
                "dimensao": "640x360",
                "motivo": "Homem gritadeiro"
            }
            , {
                "nome": "americans bury dog alive.webm",
                "tamanho": "1.11 MB",
                "dimensao": "156x250",
                "motivo": "Cachorro enterrado vivo"
            }
            , {
                "nome": "iMaX6m9.webm",
                "tamanho": "1.78 MB",
                "dimensao": "156x250",
                "motivo": "Gatinho colocado vivo dentro da parede"
            }

        ],
        "suspeito": [
            {
                "site": "yotube.com",
                "motivo": "se passa pelo o youtube"
            }
            , {
                "site": "substituir depois com mais links da blacklist",
                "motivo": "escrever o motivo, ex: deposito gemedeira"
            }
        ],
        "embutir": [
            {
                "site": "xvideos.com",
                "expressao": "/video(\\d+)/",
                "iframe": '<p><iframe src="http://flashservice.xvideos.com/embedframe/videoID" frameborder=0 width=510 height=400 scrolling=no></iframe></p>'
            }
            , {
                "site": "twitch.tv",
                "expressao": "twitch.tv/(\\w+)",
                "iframe": '<p><iframe style="width: 800px; height: 378px;" scrolling="no" frameborder="0" src="https://player.twitch.tv/?channel=videoID&autoplay=false"></iframe></p>'
            }
            , {
                "site": "xhamster.com",
                "expressao": "/movies/(\\d+)",
                "iframe": '<p><iframe width="510" height="400" src="http://xhamster.com/xembed.php?video=videoID" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
            }
            , {
                "site": "pornhub.com",
                "expressao": "viewkey=([\\d\\w]+)",
                "iframe": '<p><iframe src="http://www.pornhub.com/embed/videoID" frameborder="0" width="560" height="340" scrolling="no"></iframe></p>'
            }
            , {
                "site": "playvid.com",
                "expressao": "/watch/([\\d\\w]+)",
                "iframe": '<p><iframe width="640" height="360" src="http://www.playvid.com/embed/videoID" frameborder="0" allowfullscreen></iframe></p>'
            }
            , {
                "site": "vid.me",
                "expressao": "/vid.me/([\\d\\w]+)",
                "iframe": '<p><iframe src="https://vid.me/e/videoID?stats=1&amp;tools=1" width="630" height="420" frameborder="0" scrolling="no"></iframe></p>'
            }
            , {
                "site": "spankbang.com",
                "expressao": "spankbang.com/([\\d\\w]+)",
                "iframe": '<p><iframe width="560" height="315" src="http://spankbang.com/videoID/embed/" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
            }
            , {
                "site": ".mp4",
                "expressao": "(http:.*)",
                "iframe": '<p><video width="500" controls> <source src="videoID"> </video></p>'
            }
            , {
                "site": "vocaroo.com",
                "expressao": "/i/([\\d\\w]+)",
                "iframe": '<p><object width="148" height="44"><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=s1OWSxwrHERS&autoplay=0"/><param name="wmode" value="transparent"/><embed src="http://vocaroo.com/player.swf?playMediaID=videoID&autoplay=0" width="148" height="44" wmode="transparent" type="application/x-shockwave-flash"></embed></object><br><a href="http://vocaroo.com" style="font-size:xx-small;" title="Vocaroo Voice Recorder">Record music and voice &gt;&gt;</a></p>'
            }
            , {
                "site": "veja.abril.com.br",
                "expressao": "(.*)",
                "iframe": '<p><iframe width="1024" height="728" src="videoID" scrolling="yes" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
            }, {
                "site": "www1.folha.uol.com.br",
                "expressao": "(.*)",
                "iframe": '<p><iframe width="1024" height="728" src="videoID" scrolling="yes" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
            }
            , {
                "site": "g1.globo.com",
                "expressao": "(.*)",
                "iframe": '<p><iframe width="1024" height="728" src="videoID" scrolling="yes" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
            }

        ]
    };


    window.top.palavras = [
        {"palavra": "4chan", "filtro": "\\/pinto\\/"}
        , {"palavra": "bananal", "filtro": "chernobyl"}
        , {"palavra": "bolso", "filtro": "gibeira"}
        , {"palavra": "corno", "filtro": "corno"}
        , {"palavra": "cuck", "filtro": "corno"}
        , {"palavra": "cucko", "filtro": "cornoo"}
        , {"palavra": "cuckold", "filtro": "cornoold"}
        , {"palavra": "Dilma", "filtro": "Mandioca"}
        , {"palavra": "direit", "filtro": "sonserin"}
        , {"palavra": "enem", "filtro": "bar mitzvah"}
        , {"palavra": "esquerda", "filtro": "grifinoria"}
        , {"palavra": "esquerd", "filtro": "grifinor"}
        , {"palavra": "filtro", "filtro": "marmelo"}
        , {"palavra": "fio", "filtro": "parênquima paliçádico"}
        , {"palavra": "foda", "filtro": "fornicação"}
        , {"palavra": "fode", "filtro": "fornique"}
        , {"palavra": "foder", "filtro": "fornicar"}
        , {"palavra": "fodeu", "filtro": "fornicou"}
        , {"palavra": "fodi", "filtro": "forniquei"}
        , {"palavra": "bolso", "filtro": "gibeira"}
        , {"palavra": "holocausto", "filtro": "festa no apê"}
        , {"palavra": "rateiem", "filtro": "joguem ratos"}
        , {"palavra": "judeu", "filtro": "preto"}
        , {"palavra": "lula", "filtro": "cachaceiro"}
        , {"palavra": "mara", "filtro": "kosher"}
        , {"palavra": "mcq", "filtro": "vocês não conseguem penetrar em meu prolapso tão rápido quanto gostaria"}
        , {"palavra": "mulher", "filtro": "depósito de porra"}
        , {"palavra": "mulheres", "filtro": "depósitos de porra"}
        , {"palavra": "namorada", "filtro": "pitanga"}
        , {"palavra": "negra", "filtro": "frida"}
        , {"palavra": "negro", "filtro": "paixão"}
        , {"palavra": "negros", "filtro": "teutões"}
        , {"palavra": "olavo", "filtro": "bukowski"}
        , {"palavra": "orkut", "filtro": "foro de são paulo"}
        , {"palavra": "preto", "filtro": "judeu"}
        , {"palavra": "psy", "filtro": "batoré"}
        , {"palavra": "rateiem", "filtro": "limpo meu cu com"}
        , {"palavra": "redpil", "filtro": "rivotril"}
        , {"palavra": "rivotril", "filtro": "redpil"}
        , {"palavra": "sexo", "filtro": "dota"}
        , {"palavra": "trap", "filtro": "linguiça"}
        , {"palavra": "twitter", "filtro": "páçaro"}
        , {"palavra": "nt:", "filtro": "Nesta thread:"}
        , {"palavra": "itt:", "filtro": "Nesta thread:"}

        //essas palavras geram ban automatico
        , {"palavra": "GIFT BOX"}
        , {"palavra": "TGIFTBOX"}
        , {"palavra": "GIFTBOX"}
        , {"palavra": "facebook"}
        , {"palavra": "akamaihd"}
        , {"palavra": "7xp24woty3lxiqrk"}
        , {"palavra": "0816adadf99018d0544f1d036fe45fa1"}
        , {"palavra": "pthc"}
        , {"palavra": "r@ygold"}
        , {"palavra": "hussyfan"}
        , {"palavra": "D3751DC1BA"}
        , {"palavra": "6Vb5cND6"}
        , {"palavra": "peka"}

    ];

    window.top.ultimaRepostaAlterada = "";

    window.top.modo = {
        "mododogola": {
            "site": "https://sites.google.com/site/dogolaplus/home/dogola",
            "qtdImagens": "24",
            "extensao": "jpg",
            "zeros": "4",
            "webm": ["http://webm.land/media/qHwa.webm"],
            "filtros": [{"filtro": "mulher", "palavra": "merdalher"}, {"filtro": "esquerda", "palavra": "mortadela"}],
            "palavras": ["dogola"]
        },
        "mododilma": {
            "site": "https://sites.google.com/site/dilmagolpe/home/golpe",
            "qtdImagens": "16",
            "extensao": "jpg",
            "zeros": "5",
            "webm": ["http://webm.land/media/qHwa.webm"],
            "filtros": [{"filtro": "mulher", "palavra": "companheira"}
                , {"filtro": "esquerda", "palavra": "democracia"}
                , {"filtro": "direita", "palavra": "GOLPISTA"}
                , {"filtro": "presidente", "palavra": "GOLPISTA"}
                , {"filtro": "president", "palavra": "GOLPISTA"}],
            "palavras": ["golpe", "golpista", "comunista", "coxinha", "PT", "Lula", "companheiro", "companheira", "Dilma", "CUT", "MST"]
        },
        "modoanimu": {
            "site": "https://sites.google.com/site/modoanimu/home/animu",
            "qtdImagens": "33",
            "zeros": "4",
            "extensao": "png",
            "webm": ["http://webm.land/media/qHwa.webm"],
            "filtros": [{"filtro": "anão", "palavra": "anão-kun"}],
            "palavras": []
        }
    };

    window.top.pularPalavra = [
        "um",
        "uma",
        "uns",
        "umas",
        "outros",
        "para",
        "é",
        "e",
        "a",
        "o",
        "as",
        "os",
        "aos",
        "como",
        "de",
        "da",
        "dar",
        "das",
        "dei",
        "do",
        "dos",
        "dou",
        "que",
        "qual",
        "quais",
        "na",
        "nas",
        "no",
        "nos",
        "bem",
        "bom",
        "bons",
        "esse",
        "essa",
        "esses",
        "essas",
        "algum",
        "algumas",
        "alguns",
        "em",
        "com",
        "por",
        "pelo",
        "pelos",
        "pela",
        "pelas",
        "que",
        "mais",
        "menos",
        "meu",
        "minha",
        "meus",
        "minhas",
        "pra",
        "pro",
        "seu",
        "sua",
        "seus",
        "suas"
    ];

    window.top.modoAtivado = false;
    window.top.topicosFundidos = [];
    window.top.tempoFundirPosts = 10;
    window.top.contagemRegressiva = tempoFundirPosts;
    window.top.fundirTopicoBotao = $("<button>Fundir Tópico " + contagemRegressiva + "</button>");

    window.top.fluxoVivo = {
        'estado': "LIGAR",
        'ativado': false,
        'sincronizando': false,
        'boards': [],
        'atualizacaoFluxo': 60,
        'ultimaAtualizacao': 0,
        'multiplicadorTempoPermitido': 1.5
    };
}//</editor-fold>

//<editor-fold desc="Funções de localização">
function paginaThread() {
    return window.location.pathname.indexOf("/res/") !== -1;
}

function getPostagemId(obj) {
    return documento.find(obj).attr("id").replace("reply_", "");
}

function getThread() {
    return document.location.pathname.split("/")[1];
}
//</editor-fold>

//<editor-fold desc="Criação da caixa de Opções">
function criarOpcoes() {
    log("Criando opcoes de inicializacao");

    var conteudoDiv = '<a href=\"https://55chan.org/comp/res/5667.html\" title="55+ versão: ' + window.top.publicversion + '." target=\"_blank\">';
    conteudoDiv += '<span style="color: #FF7800;">  <span class="fa fa-heart-o">';
    conteudoDiv += '</span> </a> </span>';

    documento.find('header > h1').append(conteudoDiv);


}
//</editor-fold>

//<editor-fold desc="Alterações no CSS">
function alterarCSS() {
    log("Realizando melhorias no CSS");
    //rodape maior
    documento.find("div.boardlist.bottom").css({
        "padding": "10px"
    });
    //remoção do rodapé
    documento.find("footer").hide();
    var btn = $("p.elevator");
    documento.find("footer").parent().append(btn);
    //diminuindo banner
    documento.find("div.banner").css({
        "width": "351",
        "margin-left": "38%",
        "padding-bottom": "10px"
    });
    //Exibir formulario sempre.
    documento.find('#post-form-outer').show();

    //Retirar o autoplay no /b/
    documento.find("iframe[src*=youtube][width=0][height=0]").remove();

    //Deixar a barra superior sempre visivel
    documento.find('div.desktop-boardlist.first').css({"transform": "translateY(0%)"});

    //Ajustar janela opções.
    documento.find('#options_div').css({'height': '90%', 'margin-top': '0px', 'width': '90%'});
    documento.find('#options_div textarea').css({'height': '100%'});

    //suba de elevador sempre visível
    documento.find('.elevator').css({"position": "fixed", "right": "0", "bottom": "10px", "font-size": "15px"}).addClass('fa fa-arrow-circle-up');

    //removerPainelLateral
    if (testarPai()) {
        $('iframe[id=sidebar]').remove();
        $('iframe[id=main]').css({'left': '0px', 'width': '100%', 'height': '100%'});
    }

}
//</editor-fold>

//<editor-fold desc="Inserir Boards Ocultas">
function inserirBoardsOcultas() {
    log('Inserindo boards ocultas');
    //colocar link do abyss e arquivo
    var boardsOcultas = $('<span class="sub" data-description="8">[ </span>');
    boardsOcultas.append('<a class="abyss" href="/abyss/index.html" title="O Abismo">abyss</a> / ');
    boardsOcultas.append('<a class="arquivo" href="/arquivo/index.html" title="Arquivo">arquivo</a> ] ');

    boardsOcultas.insertAfter(documento.find('.desktop-boardlist.first > .sub').last());

}
//</editor-fold>

//<editor-fold desc="Baixar todas as imagens">
function ativarBaixarTodasAsImagens() {
    log("Habilitando o recurso de download de todas as imagens");
    var linkBaixarTodasAsImagens = $('<a class="unimportant" href=\"javascript:baixarTodasAsImagens();\"></a>');
    linkBaixarTodasAsImagens.append('<span style="color:blue"> Baixar todas as imagens/videos</span>');
    $('#expand-all-images').append(linkBaixarTodasAsImagens);
}

//noinspection JSUnusedGlobalSymbols
function baixarTodasAsImagens() {
    log("Baixando todas as imagens");
    documento.find('.fileinfo').find('a[download]').each(function () {
        $(this)[0].click();
    });
}
//</editor-fold>

//<editor-fold desc="Incorporação e verificação de links">
function embutirVideo(link, url, expressao, framewindow) {
    log("Embutindo link " + url);

    var endereco = url;
    var expressaoRegular = new RegExp(expressao, "g");
    var match = expressaoRegular.exec(endereco);

    if (match) {
        var videoID = match[1];
        var linkRemover = $('<a style="cursor:pointer"> [Fechar]</a>');
        var novoFrame = $(framewindow.replace("videoID", videoID));
        link.after(linkRemover);
        link.hide();
        linkRemover.after(novoFrame);
        linkRemover.click(function () {
            link.show();
            novoFrame.remove();
            linkRemover.remove();
        });

    }
    return true;
}

function verificarLinks(resposta) {

    resposta.find('.files .fileinfo span.unimportant').each(function () {
        if (!$(this).hasClass("arquivoVerificado")) {
            verificarArquivo($(this));
        }
    });

    resposta.find('a[rel="nofollow"]').each(function () {
        if (!apagarLinkSuspeito($(this))) {
            embutirLink($(this));
        }
    });
}

function verificarArquivo(fileInfo) {
    var informacaoArquivo = fileInfo.text();

    links.arquivo.forEach(function (arquivo) {
        if ((informacaoArquivo.indexOf(arquivo.tamanho) !== -1 && informacaoArquivo.indexOf(arquivo.dimensao))
            && (informacaoArquivo.indexOf(arquivo.tamanho) !== -1 && informacaoArquivo.indexOf(arquivo.nome))) {
            var file = $(fileInfo.parent().next('a.file'));
            var linkArquivo = $('<br/><span class="fa fa-exclamation-circle" style="color:red"> [ARQUIVO SUSPEITO] <span class="fa fa-exclamation-circle"></span></span>');
            linkArquivo.attr('color', 'red');
            linkArquivo.addClass('');
            linkArquivo.css('cursor', 'pointer');
            linkArquivo.append('<p>Motivo: ' + arquivo.motivo + '</p>');
            linkArquivo.append('<p>Clique aqui para abrir (sua conta em risco)</p>');
            linkArquivo.click(function () {
                file.show();
                file.prev().show();
                linkArquivo.remove();
            });

            file.prev().hide();
            file.hide();
            //noinspection JSCheckFunctionSignatures
            linkArquivo.insertAfter(file);
        }
    });

    fileInfo.addClass("arquivoVerificado");
}

function apagarLinkSuspeito(link) {
    var linkSuspeito = false;

    links.suspeito.forEach(function (value) {

        if (typeof link.attr('href') === 'undefined') {
            return true;
        }

        if (link.attr('href').indexOf(value.site) !== -1) {
            log("Link suspeito" + link.attr('href'));
            link.parent().append('<span style="color:red" class="fa fa-exclamation-circle"> [URL SUSPEITA. Motivo: ' + value.motivo + '] "' + link.attr('href') + '"</span>');
            link.remove();
            linkSuspeito = true;
            return false;
        }
    });

    return linkSuspeito;
}

function embutirLink(link) {
    links.embutir.forEach(function (value) {

        if (link.hasClass("embutidoPlus")) {
            return true;
        }

        if (typeof link.attr('href') === 'undefined') {
            return true;
        }


        if (link.attr('href').indexOf(value.site) !== -1) {
            log("Embutindo link" + link.attr('href'));

            var linkEmbutir = $('<a style="cursor:pointer"> [Embutir]</a>');
            link.after(linkEmbutir);

            linkEmbutir.click(function () {
                embutirVideo(linkEmbutir, link.attr('href'), value.expressao, value.iframe);
            });

            link.addClass('embutidoPlus');

        }
    });
    return true;
}
//</editor-fold>

//<editor-fold desc="Filtro e Filtro-reverso">
function monitorarFiltroPosts() {
    var ultimoElemento = documento.find("div[id*='thread_']").children(".post").last();

    if (window.top.ultimaRepostaAlterada == "") {
        window.top.ultimaRepostaAlterada = documento.find("div[id*='thread_']").children(".post").first();
    }

    if (ultimoElemento.is(window.top.ultimaRepostaAlterada)) {
        return true;
    }

    log("Alterando filtro das palavras a partir da resposta " + window.top.ultimaRepostaAlterada.attr('id'));

    var liberarReplace = false;
    $('div.post').each(function () {

        var repostaParaAlterar = $(this);

        if (repostaParaAlterar.is(window.top.ultimaRepostaAlterada)) {
            liberarReplace = true;
        }

        //Evitar que o filtro fique se repetindo nos posts ja filtrados
        if (!liberarReplace) {
            return true;
        }

        alterarPalavrasPost(repostaParaAlterar);
        verificarLinks(repostaParaAlterar);

    });
    window.top.ultimaRepostaAlterada = ultimoElemento;
}

function alterarPalavrasPost(elemento) {

    if (elemento.children().length > 0) {
        elemento.children().each(function () {
            alterarPalavrasPost($(this));
        });
    }

    elemento.contents().filter(function () {
        return this.nodeType == 3
    }).each(function () {

        //noinspection JSPotentiallyInvalidUsageOfThis
        var textoAlterado = this.textContent;
        textoAlterado = textoAlterado.replace(new RegExp('​', "gi"), '');

        palavras.forEach(function (value) {
            if (typeof value.filtro !== 'undefined') {
                textoAlterado = textoAlterado.replace(new RegExp(value.filtro, "gi"), value.palavra);
            }
        });

        if (data55Plus.modo != "nenhum") {
            var modoAtivo = modo[data55Plus.modo];
            modoAtivo.filtros.forEach(function (filtro) {
                textoAlterado = textoAlterado.replace(new RegExp(filtro.filtro, "gi"), filtro.palavra);
            });
        }

        textoAlterado = alterarTextoModo(textoAlterado);

        //noinspection JSPotentiallyInvalidUsageOfThis
        this.textContent = textoAlterado;
    });
}

function alterarPalavrasFormulario() {
    log('Alterando palavras no formulario');
    var textAreaDom = documento.find('textarea[id=body]');
    var textoAlterado = textAreaDom.val();

    palavras.forEach(function (value) {

        textoAlterado = textoAlterado.replace(new RegExp(value.palavra, "gi"), function (palavra) {
            var tamanhoPalavra = palavra.length;
            return palavra.substring(0, tamanhoPalavra - 1) + '\u200b' + palavra.substring(tamanhoPalavra - 1, tamanhoPalavra);
        });

        //if(textAreaDom.val().indexOf(value.palavra) !== -1){
        //log('Palavra alterada ' + value.palavra +' -> '+ textoAlterado);
        //}

        textAreaDom.val(textoAlterado);
    });
}

function incluirEventoFiltroFormulario() {
    documento.find('#quick-reply,#post-form-inner').find('form').each(function () {

        //noinspection JSUnresolvedFunction
        if (!($._data(this, "events"))) {
            log('Inlcluindo evento no formulario');
            $(this).on('submit', alterarPalavrasFormulario);
        }
    });

}

function ativarFiltros() {
    monitorarFiltroPosts();
    documento.find('#quick-reply').show();
}
//</editor-fold>

//<editor-fold desc="Esconder respostas">
function esconderResposta(linkEsconder) {
    linkEsconder.parent().parent().find('div.body').toggle();
    linkEsconder.parent().parent().find('div.files').toggle();
    linkEsconder.parent().parent().find('div.video-container').toggle();
    var replyNo = linkEsconder.prev().text();
    var indexArray = data55Plus.respostasEscondidas.indexOf(replyNo);

    if (linkEsconder.text() == " [ - ] ") {
        linkEsconder.text(" [ + ] ");
        if (indexArray < 0) {
            data55Plus.respostasEscondidas.push(replyNo);
            gravarDados();
        }
    } else {
        linkEsconder.text(" [ - ] ");
        if (indexArray != -1) {
            data55Plus.respostasEscondidas.splice(indexArray, 1);
            gravarDados();
        }
    }

    gravarDados();
}


function inserirLinksEsconderPosts() {
    log("Inserindo links para esconder Posts");
    documento.find("div.post .intro").each(function () {
        var linkNumeroPost = $(this).find('.post_no').last();

        if (linkNumeroPost.hasClass("esconderPlus")) {
            return true;
        }

        var linkEsconder = $('<a style="cursor:pointer"> [ - ] </a>');
        linkNumeroPost.after(linkEsconder);

        linkEsconder.attr('id', 'linkEsconder' + linkEsconder.prev().text());
        linkEsconder.click(function () {
            esconderResposta($(this));
        });

        linkNumeroPost.addClass('esconderPlus');
    });
}

function esconderRespostasAnteriormenteEscondidas() {
    log("Escondendo respostas anteriormente escondidas");

    data55Plus.respostasEscondidas.forEach(function (replyNo) {
        $('a[id=linkEsconder' + replyNo + ']').click();
    });
}
//</editor-fold>

//<editor-fold desc="Operações com dados">
function lerDados(arrayCallbacks) {
    try {
        //sessionStorage.getItem('data55Plus');
        localStorage.getItem('data55Plus');

        window.top.data55PlusLocalStorage = localStorage.getItem('data55Plus');
    } catch (err) {
        console.error("Erro na recuperação dos dados" + err);
    }

    if (window.top.data55PlusLocalStorage !== null) {
        window.top.data55Plus = JSON.parse(window.top.data55PlusLocalStorage);
    }

    arrayCallbacks.forEach(function (callback) {
        callback();
    });

}

function gravarDados() {
    /*
     Por um BUG ou burrice dos programadores  Mozilla, para você persistir uma informação no navegador, é necessário que você leia ela depois de salva-la.
     @BUG https://bugs.chromium.org/p/chromium/issues/detail?id=160056
     */
    localStorage.setItem("data55Plus", JSON.stringify(data55Plus));
    localStorage.getItem('data55Plus');
    return true;
}
//</editor-fold>

//<editor-fold desc="Botao de download do youtube">
function downloadVideosYoutube() {
    log('Adicionando links para baixar videos do youtube');


    documento.find("div[class=video-container]").each(function () {
        var idVideo = $(this).attr("data-video");
        var botaoDownloadVideo = $('<a></a>');
        botaoDownloadVideo.addClass("fa fa-download fa-lg");
        botaoDownloadVideo.attr('href', 'http://youtubeinmp4.com/youtube.php?video=https://www.youtube.com/watch?v=' + idVideo);
        botaoDownloadVideo.attr('target', '_blank');
        botaoDownloadVideo.text(' Baixar em .mp4 ');

        //noinspection JSCheckFunctionSignatures
        botaoDownloadVideo.insertAfter($(this));
    });
}
//</editor-fold>

//<editor-fold desc="Modos especiais">
function ativarAtalhosTeclado() {
    var teclaDigitada = "";
    var tempoApagar = new Date().getTime();

    //noinspection JSUnresolvedFunction
    documento.keydown(function (e) {

        if (new Date().getTime() - tempoApagar > 30000) {
            teclaDigitada = "";
            tempoApagar = new Date().getTime();
        }

        teclaDigitada += String.fromCharCode(e.keyCode).toLowerCase();

        $.each(modo, function (key) {
            var modoDigitado = key.toString();
            if ((teclaDigitada.toString().indexOf(modoDigitado) !== -1)) {
                teclaDigitada = "";
                window.top.modoAtivado = false;
                data55Plus.modo = modoDigitado;
                gravarDados();
                log('Ativar modo: ' + modoDigitado);
                ativarModo();
                window.top.ultimaRepostaAlterada = "";
                monitorarFiltroPosts();
            }
        });

        if (["desligamodo", "desligarmodo", "mododesligado", "modoff", "modonormal"].indexOf(teclaDigitada) != -1) {
            log("Desliga Modo");
            data55Plus.modo = "nenhum";
            gravarDados();
            location.reload();
        }

        if ((teclaDigitada.toString().indexOf("limpardados") !== -1)) {
            log("limpandoDados");
            localStorage.removeItem('data55Plus');
            location.reload();
        }

    });
}

function ativarModo() {

    if ((data55Plus.modo == "nenhum") || (window.top.modoAtivado)) {
        return true;
    }

    log(data55Plus.modo + ": on");

    var modoAtivo = window.top.modo[data55Plus.modo];

    documento.find('.post-image,img').each(function () {
        var dogolaRandom = Math.floor(Math.random() * modoAtivo.qtdImagens) + 1;
        dogolaRandom = ("0000000000" + dogolaRandom ).slice(-modoAtivo.zeros);
        $(this).attr('src', modoAtivo.site + dogolaRandom.toString() + '.' + modoAtivo.extensao);

    });

    documento.find('body').css('background-image', "url('" + modoAtivo.site + "Fundo.jpg')");
    if (data55Plus.modo == "modoanimu") {
        documento.find('body').css({"background-attachment": "fixed"});
    }
    documento.find('.board_image').attr('src', modoAtivo.site + 'Banner.jpg');

    documento.find('a.file').each(function () {
        var arquivo = $(this);
        var nomeArquivo = arquivo.attr('href');

        if (nomeArquivo.indexOf('.mp4')) {

            var novoLink = arquivo.clone();
            novoLink = novoLink.attr('href', modoAtivo.webm[Math.floor(Math.random() * modoAtivo.webm.length)]);
            novoLink.videoAlreadySetUp = false;
            //noinspection JSCheckFunctionSignatures
            novoLink.insertAfter(arquivo);


            arquivo.remove();
            try {
                //noinspection JSUnresolvedFunction
                setupVideo(novoLink[0], novoLink.attr('href'));
            } catch (err) {

                log('Erro no modo a.file' + err.message);
            }

        }

    });

    documento.find('.body iframe').each(function () {
        var dogolaRandom = Math.floor(Math.random() * modoAtivo.qtdImagens) + 1;
        dogolaRandom = ("0000000000" + dogolaRandom ).slice(-modoAtivo.zeros);

        var frame = $(this);
        var frameDogolado = $("<img/>");

        frameDogolado.attr('src', modoAtivo.site + dogolaRandom.toString() + '.' + modoAtivo.extensao);
        frameDogolado.attr('width', frame.attr('width'));
        frameDogolado.attr('height', frame.attr('height'));
        frameDogolado.attr('href', modoAtivo.webm[Math.floor(Math.random() * modoAtivo.webm.length)]);

        //noinspection JSCheckFunctionSignatures
        frameDogolado.insertAfter(frame);
        frame.remove();


        try {
            //noinspection JSUnresolvedFunction
            setupVideo(frameDogolado[0], frameDogolado.attr('href'));
        } catch (err) {

            log('Erro na no modo iframe ' + err.message);
        }
    });


    documento.find('img').width("");
    documento.find('img').height("");
    documento.find('img').css({"max-width": "255px"});


    window.top.modoAtivado = true;
}


function alterarTextoModo(textoAntigo) {

    if (data55Plus.modo != "nenhum") {
        var novoTexto = "";
        var palavraPulada = false;
        var modoAtivo = modo[data55Plus.modo];

        textoAntigo.split(/\s+/i).forEach(function (palavra) {

            if ((modoAtivo.palavras.length > 0) && (pularPalavra.indexOf(palavra.toLowerCase()) !== -1)) {
                palavraPulada = true;
                novoTexto += ' ' + palavra;
                return true;
            } else if (palavraPulada) {
                var novaPalavra = modoAtivo.palavras[Math.floor(Math.random() * modoAtivo.palavras.length)];
                if (palavra == palavra.toUpperCase()) {
                    novaPalavra = novaPalavra.toUpperCase();
                }
                novoTexto += ' ' + novaPalavra + ' ';
                palavraPulada = false;
                return true;
            }
            novoTexto += ' ' + palavra;
        });
        textoAntigo = novoTexto;
    }
    return textoAntigo;
}
//</editor-fold>

//<editor-fold desc="Reportar postagem">
function menuReportarPostagem() {
    documento.find("div.post.reply").each(function () {
        var replyId = getPostagemId(this);
        $(this).find("p.intro a.post_no").eq(1).after('<a href="javascript:reportarPostagem(' + replyId + ')" title="Reportar Thread"><i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i></a>');
    });
}

function reportarPostagem(id) {
    var motivo = prompt("Informe o motivo do report.", "");
    if (motivo !== null) {
        try {
            var post = String("{\"delete_" + id + "\": \"\", \"password\" : \"" + $("#password").val() + "\", \"board\": \"" + getThread() + "\", \"reason\":\"" + motivo + "\",\"report\":\"Denunciar\"}");

            $.post('/altpost.php', JSON.parse(post), function () {
                alert("Postagem reportada com sucesso.")
            });

        } catch (err) {
            console.error("Erro ao reportar postagem: " + err);
        }

    }
}
//</editor-fold>

//<editor-fold desc="IRC">
function criarJanelaIRC() {
    log('Criando a janela de IRC');

    if (documento.find('body > div[id=chatIRC]').length > 0) {
        return true;
    }

    var botaoAbrir = $('<a href="#" title="plusIRC" > [Chat IRC] </a>');
    botaoAbrir.css({'float': 'right', 'padding-right': '10px'});

    botaoAbrir.click(function () {
        divJanelaIRC.append(janelaIRC);
        divJanelaIRC.css({'minHeight': '350px', 'minWidth': '650px'});
        botaoFechar.show();
        botaoAbrir.hide();
    });

    botaoAbrir.insertAfter(documento.find('a[title="plusCatalogo"]'));

    var janelaIRC = $('<iframe></iframe>');
    janelaIRC.attr('src', 'https://qchat.rizon.net/?randomnick=1&channels=55chan&prompt=1&uio=MT1mYWxzZSYxNj10cnVlJjExPTE3NA66');
    janelaIRC.css({'minHeight': '350px', 'minWidth': '650px', 'width': '100%', 'height': '100%'});


    var divJanelaIRC = $('<div id="chatIRC"></div>');
    divJanelaIRC.css({'background-color': '#EDFCFF'});

    divJanelaIRC.css({
        'position': 'fixed',
        'right': '0',
        'bottom': '20px'
    });

    var botaoFechar = $('<a href="#"> [ Esconder Chat ] </a></br>');
    botaoFechar.click(function () {
        janelaIRC.remove();
        divJanelaIRC.css({'minHeight': '0', 'minWidth': '0'});
        botaoFechar.hide();
        botaoAbrir.show();
    });

    divJanelaIRC.append(botaoFechar);
    botaoFechar.hide();


    documento.find('body').append(divJanelaIRC);

}
//</editor-fold>

//<editor-fold desc="Link Catálogo">
function inserirLinkCatalogo() {
    log('Criando barra de opcoes');
    var caminho = window.location.pathname;
    var expressaoRegular = new RegExp('/[\\w\\d]+/', "g");
    var board = expressaoRegular.exec(caminho);

    var novoLink = $('<a title="plusCatalogo" href="' + board + 'catalog.html" > [Catálogo] </a>');
    novoLink.css({'float': 'right', 'padding-right': '10px'});


    novoLink.insertAfter(documento.find('a[title="Opções"]'));
}
//</editor-fold>

//<editor-fold desc="Fundir tópico">
function criarFundirTopico() {

    var fundirTopicoCaixa = $(" <input /> ");
    fundirTopicoCaixa.css({'width': '200px'});

    fundirTopicoBotao.click(function () {
        var expressaoRegular = new RegExp('(http://55chan.org/[\\w\\d\\$\\%C3\\%B4]+/res/(\\d+)\\.html)', "g");
        var match = expressaoRegular.exec(fundirTopicoCaixa.val());

        if (match) {
            var indexArray = topicosFundidos.indexOf(match[1]);
            if (indexArray < 0) {
                topicosFundidos.push(match[1]);
                var novoPostFundido = $('<a> ' + match[2] + ' [x] <a>');
                novoPostFundido.click(function () {
                    var indexArray = topicosFundidos.indexOf(match[1]);
                    topicosFundidos.splice(indexArray, 1);
                    novoPostFundido.remove();
                });
                //noinspection JSCheckFunctionSignatures
                novoPostFundido.insertBefore(fundirTopicoCaixa);
            }
        }
    });
    var fundirTopicoDiv = $("<div></div>");
    fundirTopicoDiv.css({'text-align': 'right'});
    fundirTopicoDiv.append(fundirTopicoCaixa);
    fundirTopicoDiv.append(fundirTopicoBotao);

    fundirTopicoDiv.insertAfter(documento.find('#gallery-view'));
}

function fundirTopico(postUrl) {

    var new_posts = 0;
    var first_new_post = null;
    var title = document.title;

    var update_title = function () {
        if (new_posts) {
            document.title = "(" + new_posts + ") " + title;
        } else {
            document.title = title;
        }
    };

    var recheck_activated = function (end_of_page) {
        if (typeof end_of_page == "undefined") end_of_page = false;
        //noinspection JSValidateTypes
        if (end_of_page || (new_posts && $(window).scrollTop() + $(window).height() >= $('div.boardlist.bottom').position().top)) {
            new_posts = 0;
        }
        update_title();
        first_new_post = null;
    };

    $.ajax({
        url: postUrl,
        success: function (data) {
            $(data).find('div.post.reply').each(function () {
                var id = $(this).attr('id');
                if ($('#' + id).length == 0) {
                    $(this).insertAfter(documento.find('div.post:not(.post-hover):last').next()).after('<br class="clear">');
                    new_posts++;
                    $(document).trigger('new_post', this);
                    recheck_activated();
                }
            });
        }
    });

}

function adicionarPostsFundidos() {
    fundirTopicoBotao.text("Fundir Tópico " + window.top.contagemRegressiva);
    if (window.top.contagemRegressiva == 0) {
        topicosFundidos.forEach(function (topico) {
            fundirTopico(topico);
        });
        window.top.contagemRegressiva = tempoFundirPosts;
    } else {
        window.top.contagemRegressiva = contagemRegressiva - 1;
    }
}
//</editor-fold>

//<editor-fold desc="Fluxo Vivo">
//noinspection JSUnresolvedFunction
function inserirPostFluxo(post, thread, board) {
    if (fluxoVivo.estado == "LIGAR") {
        desativarFluxoVivo();
        return true;
    }
    //Somente para retirar erros do Intellij IDEA
    if (typeof post === "undefined") {
        post = {
            "no": 16866852,
            "sub": "Fluxo Vivo",
            "com": "Nova Versão 2.5.1",
            "name": "Anônimo",
            "time": 1463517612,
            "omitted_posts": 0,
            "omitted_images": 0,
            "sticky": 0,
            "locked": 0,
            "last_modified": 1463520179,
            "tn_h": 143,
            "tn_w": 255,
            "h": 720,
            "w": 1280,
            "fsize": 11226951,
            "filename": "1463487439439",
            "ext": ".mp4",
            "tim": "1463517612146",
            "md5": "KCz4wez5UDeI7q0llWHDFQ==",
            "resto": 0
        };
    }

    var postNo = post.no;

    if (documento.find('#reply_' + postNo).length > 0) return true;
    if (documento.find('#op_' + postNo).length > 0) return true;

    log('Inserindo post ' + post.no);

    var divPost = $('<div class="post reply"></div>');

    if (typeof post.omitted_posts !== "undefined") {
        divPost.attr('id', 'op_' + postNo);
    } else {
        divPost.attr('id', 'reply_' + postNo);
    }

    var dataPost = new Date();
    dataPost.setTime(post.time * 1000);
    var pIntro = $('<p class="intro"></p>');
    var pIntroConteudo = '<label><span class="name"> ' + post.name + ' </span><time datetime="' + dataPost.toISOString() + '">' + dataPost.toLocaleString() + '</time></label>';

    pIntroConteudo += '<a class="post_no" id="post_no_' + postNo + '" onclick="highlightReply(' + postNo + ')"';
    pIntroConteudo += 'href="/b/res/' + thread + '.html#' + postNo + '">No. </a>';

    pIntroConteudo += '<a class="post_no" onclick="citeReply(' + postNo + ')"';
    pIntroConteudo += 'href="/b/res/' + thread + '.html#q' + postNo + '" target="_blank">' + postNo + '</a>';

    pIntro.append(pIntroConteudo);
    divPost.append(pIntro);

    if (typeof post.filename !== "undefined") {
        var divFiles = $('<div class="files"></div>');


        var divMultifile = $('<div class="file multifile"></div>');
        var fileName = post.filename + post.ext;
        var serverFileName = post.tim + post.ext;
        var fileInfo = '<span>Arquivo </span><a href="/' + board + '/src/' + serverFileName + '" target="_blank">' + serverFileName + '</a>';
        fileInfo += '<span class="unimportant arquivoVerificado"> (' + post.fsize + ' B, ' + post.w + 'x' + post.h;
        fileInfo += ', <a download="' + fileName + '" href="/' + board + '/src/' + serverFileName + '" title="Salvar com nome de arquivo original">' + fileName + '</a>)';
        fileInfo += '<span class="image_id"><a href="http://imgops.com/http://55chan.org/' + board + '/src/' + serverFileName + '" target="_blank"> ImgOps </a>';
        fileInfo += '<a href="https://www.google.com/searchbyimage?image_url=http%3A%2F%2F55chan.org%2Fb%2Fsrc%2F' + serverFileName + '" target="_blank"> Google </a> </span></span>';

        var pFileInfo = $('<p class="fileinfo"></p>');
        pFileInfo.append(fileInfo);
        divMultifile.append(pFileInfo);

        var extensaoThumb = post.ext;
        var extensoesJPG = [".webm", ".mp4", ".mp3"];
        if (extensoesJPG.indexOf(extensaoThumb) != -1) {
            extensaoThumb = ".jpg";
        }
        var imgFileInfo = $('<a href="/' + board + '/src/' + serverFileName + '" target="_blank"><img class="post-image" src="/' + board + '/thumb/' + post.tim + extensaoThumb + '"></a>');
        imgFileInfo.find('img').css({"max-width": "255px", "max-height": "255px"});

        imgFileInfo.click(function (e) {
            e.preventDefault();
            var fullImage = $(this).find('.full-image');
            var thumbImage = $(this).find('.post-image');
            if (fullImage.length == 0) {
                fullImage = $('<img class="full-image" src="/' + board + '/src/' + serverFileName + '">');

                var carregandoIcon = $('<span style="float-left" class="fa fa-cog fa-spinner fa-spin fa-5x"></span>"');
                imgFileInfo.append(carregandoIcon);
                //carregandoIcon.css({"float": "left", "margin-left" : "-180px", "transform": "translateY(100%)", "color": "#FF7800"});

                fullImage.on('load', function () {
                    imgFileInfo.append(fullImage);
                    thumbImage.hide();
                    carregandoIcon.remove();
                });


            } else {
                fullImage.toggle();
                thumbImage.toggle();
            }
        });


        divMultifile.append(imgFileInfo);

        divFiles.append(divMultifile);
        divPost.append(divFiles);
    }

    var divBody = $('<div class="body"></div>');
    if (typeof post.com == "undefined") {
        divBody.css({"clear": "both"});
    } else {
        divBody.html(post.com);
    }

    divPost.append(divBody);
    divPost.css({"display": "none"});

    var divThread = documento.find('div[id*=thread_]:first');


    var posicaoAntigaPost = divPost;
    documento.find('div[id*=thread_]:first > .reply').each(function () {
        var posicaoPost = $(this);
        //noinspection JSValidateTypes
        if (posicaoPost.offset().top >= $(window).scrollTop()) {
            posicaoAntigaPost = posicaoPost;
            return false;
        }
    });


    divThread.prepend('</br>');
    divThread.prepend(divPost);
    divPost.fadeIn('slow');

    //noinspection JSValidateTypes
    if (!($(window).scrollTop() < divPost.offset().top)) {
        documento.find('html, body').scrollTop(posicaoAntigaPost.offset().top);
    }
}

function monitorarFluxoThread(board, threadsRestantes, boardsRestantes) {
    if (fluxoVivo.estado == "LIGAR") {
        desativarFluxoVivo();
        return true;
    }

    if (threadsRestantes.length == 0 && boardsRestantes == 0) {
        fluxoVivo.sincronizando = false;
        log('Reiniciando monitoramento das threads');
        setTimeout(iniciarFluxoVivo, fluxoVivo.atualizacaoFluxo * 100);
        return true;
    } else if (threadsRestantes.length == 0 && boardsRestantes.length > 0) {
        monitorarFluxoBoard(boardsRestantes);
        return true;
    }

    var thread = threadsRestantes[0];
    threadsRestantes.splice(0, 1);
    log('Verificando posts do ' + board + ' thread ' + thread);
    //noinspection JSCheckFunctionSignatures
    $.getJSON('http://55chan.org/' + board + '/res/' + thread + '.json', function (data) {

        $.each(data, function (key, data) {

            data.forEach(function (post) {

                if ((fluxoVivo.ultimaAtualizacao - post.time) <= (fluxoVivo.atualizacaoFluxo * fluxoVivo.multiplicadorTempoPermitido)) {
                    inserirPostFluxo(post, thread, board);
                }
            });
        });



        monitorarFluxoThread(board, threadsRestantes, boardsRestantes);
    }).fail(function () {
        log('Erro na busca do arquivo json /res/thread.json');
        monitorarFluxoThread(board, threadsRestantes, boardsRestantes);
    });

}

function monitorarFluxoBoard(boardsRestantes) {

    if (fluxoVivo.estado == "LIGAR") {
        desativarFluxoVivo();
        return true;
    }

    var board = boardsRestantes[0];
    boardsRestantes.splice(0, 1);

    fluxoVivo.ultimaAtualizacao = Math.floor($.now() / 1000);
    log('Monitorando fluxo da board ' + board);
    var threadsParaMonitorarFluxo = [];
    //noinspection JSCheckFunctionSignatures
    $.getJSON('http://55chan.org/' + board + '/threads.json', function (data) {


        $.each(data, function (key, data) {
            //noinspection JSUnresolvedVariable
            data.threads.forEach(function (thread) {
                //300 segundos = 5 minutos
                if ((fluxoVivo.ultimaAtualizacao - thread.last_modified) <= (fluxoVivo.atualizacaoFluxo * fluxoVivo.multiplicadorTempoPermitido)) {
                    threadsParaMonitorarFluxo.push(thread.no);
                }
            });
        });
        monitorarFluxoThread(board, threadsParaMonitorarFluxo, boardsRestantes);
    }).fail(function () {
        log('Erro na busca do arquivo threads.json');
        monitorarFluxoThread(board, threadsParaMonitorarFluxo, boardsRestantes);
    });
}

function monitorarFluxoVivo() {
    if (fluxoVivo.sincronizando) return true;

    if (fluxoVivo.estado == "LIGAR") {
        desativarFluxoVivo();
        return true;
    }

    fluxoVivo.sincronizando = true;

    log('Monitorando fluxo vivo');
    //noinspection JSCheckFunctionSignatures
    $.ajax({
        dataType: "json",
        url: "http://55chan.org/populars.json",
        success: function(data) {

            var boardsParaMonitorarFluxo = [];
            $.each(data, function (key, boardPolpular) {
                fluxoVivo.boards.forEach(function (board) {
                    if (board.nomeBoard == boardPolpular && board.boardAtiva == true) {
                        boardsParaMonitorarFluxo.push(boardPolpular);
                    }
                })
            });

            monitorarFluxoBoard(boardsParaMonitorarFluxo);

        },
        timeout: fluxoVivo.atualizacaoFluxo * 100
    }).fail( function( xhr, status ) {
        if( status == "timeout" ) {
            log('Timeout na busca do arquivo populars.json');
        } else {
            log('Erro na busca do arquivo populars.json');
        }
        fluxoVivo.sincronizando = false;
        monitorarFluxoVivo();
    });
}

function iniciarFluxoVivo() {

    fluxoVivo.ultimaAtualizacao = Math.floor($.now() / 1000);
    if (fluxoVivo.ativado == false) {
        fluxoVivo.ativado = true;
        var cssLinkFluxo;
        cssLinkFluxo = {
            'text-decoration': 'underline'
        };

        $('.desktop-boardlist.first > .sub >a').each(function () {

                var expressaoRegular = new RegExp('/([\\w\\d]+)/index\\.html', "g");
                var board = expressaoRegular.exec($(this).attr('href'));
                var boardsExcluidas = ["tudo"];
                if ((board != null) && (boardsExcluidas.indexOf(board[1]) == -1)) {
                    var objetoBoard = {"nomeBoard": board[1], "boardAtiva": true};
                    fluxoVivo.boards.push(objetoBoard);

                    $(this).attr('href', '#');
                    $(this).css(cssLinkFluxo);

                    $(this).attr('href', '#').click(function () {
                        if ($(fluxoVivo.boards).index(objetoBoard) == -1) {
                            fluxoVivo.boards.push(objetoBoard);
                            $(this).css(cssLinkFluxo);
                        } else {
                            $(this).css({'text-decoration': ''});
                            fluxoVivo.boards.splice($(fluxoVivo.boards).index(objetoBoard), 1);
                        }

                        console.log(fluxoVivo.boards);
                    });
                }
            }
        )
    }

    if (fluxoVivo.estado == "DESLIGAR") {
        log('Iniciando fluxo vivo');
        monitorarFluxoVivo();
    } else {
        log('Encerrando fluxo vivo');
        desativarFluxoVivo();
    }
}

function desativarFluxoVivo() {
    fluxoVivo.estado = "LIGAR";
    fluxoVivo.sincronizando = false;
    log('Fluxo vivo desativado ' + arguments.callee.caller.toString().match(/function\s+([^\s\(]+)/)[1]);
}

function criarFluxoVivo() {
    log('Criando o link para ');

    if ($('body').find('div#plusFluxoVivo').length > 0) return true;

    var bocaoAtivarFluxoVivo = $('<a href="#descer" title="plusFluxoVivo" > [Fluxo Vivo: ' + fluxoVivo.estado + '] </a>');
    //bocaoAtivarFluxoVivo.css({'float': 'right', 'padding-right': '10px'});

    bocaoAtivarFluxoVivo.click(function () {
        if (fluxoVivo.estado == "DESLIGAR") {
            fluxoVivo.estado = "LIGAR";
            bocaoAtivarFluxoVivo.css({'text-decoration': ''});
        } else {
            fluxoVivo.estado = "DESLIGAR";
            bocaoAtivarFluxoVivo.css({'text-decoration': 'undeline'});
        }

        bocaoAtivarFluxoVivo.text('[Fluxo Vivo: ' + fluxoVivo.estado + ']');

        iniciarFluxoVivo();
    });

    bocaoAtivarFluxoVivo.insertAfter(documento.find('a[title="plusIRC"]'));
}
//</editor-fold>

//<editor-fold desc="Carregamento das imagens no cache">
function carregarImagensNoCache() {
    documento.find('img.post-image:not(.carregadaCache)').each(function(){
        $(this).addClass('carregadaCache');

        var arquivo = $(this).parent().attr('href');
        var imagens = ["jpg","png","gif"];
        var videos = ["webm","mp4"];

        imagens.forEach(function(value){
            if(arquivo.indexOf(value) != -1){
                console.log(arquivo);
                $("<img/>").attr("src",arquivo).appendTo(window.top.document.head);
                return false;
            }
        });

        videos.forEach(function(value){
            if(arquivo.indexOf(value) != -1){
                var expressao = new RegExp('/player.php\\?v=(.*)&t=','gi');
                arquivo = expressao.exec(arquivo)[1];
                var video = $('<video type="video/' + value +'"></video>').attr("src",arquivo).appendTo(window.top.document.head);

                video[0].load();

                
            }
        });
    });
}
//</editor-fold>
