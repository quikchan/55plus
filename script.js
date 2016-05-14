var log = function(mensagem) {
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();

    if (typeof ativarLog === 'undefined' || ativarLog === true) {
        console.log(hh+":"+mm+":"+ss+" - "+mensagem);
    }
}

function checharPaginaEmbutida() {
      if(($('body', window.parent.document).hasClass('home')) && (!testarPai())){

        var myNewScript = document.createElement('script');
        myNewScript.setAttribute('type','text/javascript');
        myNewScript.text = localStorage.user_js;
      
        window.top.document.getElementsByTagName("head")[0].appendChild(myNewScript);
        window.top.carregadoNoPai = true;
        return true;
      }
      
      
      return false;
}

function testarPai(){
  return typeof window.top.carregadoNoPai !== 'undefined';
}


$(document).ready(function() {
    
    if(checharPaginaEmbutida()){
      log("Carregando script no pai.");
      return true;
    }
    
    if(testarPai()){
      log("Script carregado no pai.");
      return true;
    }

    log("Chan +Plus");
    log("Inicializando script");

    iniciar55Plus();
});  

function verificarPluginFilho(){
   documento = $("iframe[id=main]").contents();
   
   if(documento.find('body').attr('id') != "55Plus"){
      log('Iniciando 55Plus no filho.');
      documento.find('body').attr('id','55Plus');
        iniciar55Plus();
    }
}

if(typeof carregadoNoPai != "undefined"){
  verificarPluginFilho();
  setInterval(window.top.verificarPluginFilho,1000);
} else {
  documento = $(document);
}

function iniciar55Plus(){

  criarOpcoes();
  alterarCSS();
  
  
  inserirLinksEsconderPosts();
  lerDados([esconderRespostasAnteriormenteEscondidas,ativarModo,ativarFiltros]);
  setInterval(function(){lerDados([ativarModo,incluirEventoFiltroFormulario]);},1000);    
  
  if (paginaThread()){
      ativarBaixarTodasAsImagens();
      downloadVideosYoutube();        
  }
  
  setInterval(ativarFiltros,10000);
  ativarAtalhosTeclado();
  menuReportarPostagem();
  criarJanelaIRC();
  inserirLinkCatalogo();

  //TODO
  //cache de imagens
  //pesquisar imagens no google
  //Criar Menu personalizado
  //Poder alterar CSS do chan on-demand
  //Usuário pode colocar uma imagem de papel de parede no chan
  //Usuário pode colocar música para tocar no chan
  //Auto arquivar threads no cache da maquina do usuário (não salvar imagens)
}

var ativarLog = true;

function paginaThread(){
    return window.location.pathname.indexOf("/res/") !== -1;
}

function getPostagemId(obj){
  return documento.find(obj).attr("id").replace("reply_","");
}

function getThread(){
  return document.location.pathname.split("/")[1];
}

function criarOpcoes() {
    log("Criando opcoes de inicializacao");
    var plusDiv = $("<div id='plusDiv'></div>");
    plusDiv.append('<p><font color="red"><span class="fa fa-cog fa-2x fa-spin"></span> Chan +Plus</font>');
    plusDiv.append("Dúvidas, sugestões e colaboração: <a href=\"https://55chan.org/comp/res/5667.html\" target=\"_blank\">Thread oficial</a> </p>");
    documento.find('div.subtitle').append(plusDiv);
}

/*
Concentrar todas as alterações de CSS aqui
*/
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
    documento.find('div.desktop-boardlist.first').css({"transform":"translateY(0%)"});
    
    //Ajustar janela opções.
    documento.find('#options_div').css({'height': '90%', 'margin-top':'0px', 'width': '90%'});
    documento.find('#options_div textarea').css({'height': '100%'});
    
    //removerPainelLateral
    if(testarPai()){
      $('iframe[id=sidebar]').remove();
      $('iframe[id=main]').css({'left':'0px', 'width': '100%', 'height' : '100%'});
    };
}

function ativarBaixarTodasAsImagens() {
    log("Habilitando o recurso de download de todas as imagens");
    var linkBaixarTodasAsImagens = $('<a class="unimportant" href=\"javascript:baixarTodasAsImagens();\"></a>');
    linkBaixarTodasAsImagens.append('<font color="blue"> Baixar todas as imagens/videos</font>');
    $('#expand-all-images').append(linkBaixarTodasAsImagens);
}

function baixarTodasAsImagens() {
    log("Baixando todas as imagens");
    documento.find('.fileinfo').find('a[download]').each(function() {
        $(this)[0].click();
    });
}

var links = {
    "arquivo" : [
        {
          "nome" : "Moleque Chutadeiro.mp4",
          "tamanho" : "130.74 KB",
          "dimensao" : "400x400",
          "motivo" : "Áudio da mulher gemedeira"
        }
        ,{
          "nome" : "cats.webm",
          "tamanho" : "1.21 MB",
          "dimensao" : "1280x720",
          "motivo" : "Homem gritadeiro"
        }
        ,{
          "nome" : "1461045106997.webm",
          "tamanho" : "961.33 KB",
          "dimensao" : "640x360",
          "motivo" : "Homem gritadeiro"
        }
        ,{
          "nome" : "americans bury dog alive.webm",
          "tamanho" : "1.11 MB",
          "dimensao" : "156x250",
          "motivo" : "Cachorro enterrado vivo"
        }
        ,{
          "nome" : "iMaX6m9.webm",
          "tamanho" : "1.78 MB",
          "dimensao" : "156x250",
          "motivo" : "Gatinho colocado vivo dentro da parede"
        }          
        
    ],
    "suspeito": [
        {
          "site" : "yotube.com",
          "motivo" : "se passa pelo o youtube"
        }
        ,{
          "site" : "substituir depois com mais links da blacklist",
          "motivo" : "escrever o motivo, ex: deposito gemedeira"
        }
    ],
    "embutir": [
        {
          "site": "xvideos.com",
          "expressao": "/video(\\d+)/",
          "iframe": '<p><iframe src="http://flashservice.xvideos.com/embedframe/videoID" frameborder=0 width=510 height=400 scrolling=no></iframe></p>'
        }
        ,{
          "site": "twitch.tv",
          "expressao": "twitch.tv/(\\w+)",
          "iframe": '<p><iframe style="width: 800px; height: 378px;" scrolling="no" frameborder="0" src="https://player.twitch.tv/?channel=videoID&autoplay=false"></iframe></p>'
        }
        ,{
          "site": "xhamster.com",
          "expressao": "/movies/(\\d+)",
          "iframe": '<p><iframe width="510" height="400" src="http://xhamster.com/xembed.php?video=videoID" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
        }
        ,{
          "site": "pornhub.com",
          "expressao": "viewkey=([\\d\\w]+)",
          "iframe": '<p><iframe src="http://www.pornhub.com/embed/videoID" frameborder="0" width="560" height="340" scrolling="no"></iframe></p>'
        }
        ,{
          "site": "playvid.com",
          "expressao": "/watch/([\\d\\w]+)",
          "iframe": '<p><iframe width="640" height="360" src="http://www.playvid.com/embed/videoID" frameborder="0" allowfullscreen></iframe></p>'
        }
        ,{
          "site": "vid.me",
          "expressao": "/vid.me/([\\d\\w]+)",
          "iframe": '<p><iframe src="https://vid.me/e/videoID?stats=1&amp;tools=1" width="630" height="420" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen scrolling="no"></iframe></p>'
        }
        ,{
          "site": "spankbang.com",
          "expressao": "spankbang.com/([\\d\\w]+)",
          "iframe": '<p><iframe width="560" height="315" src="http://spankbang.com/b7p5/embed/" frameborder="0" scrolling="no" allowfullscreen></iframe></p>'
        }
        ,{
          "site": ".mp4",
          "expressao": "(http:.*)",
          "iframe": '<p><video width="500" controls> <source src="videoID"> </video></p>'
        }
        ,{
          "site": "vocaroo.com",
          "expressao": "/i/([\\d\\w]+)",
          "iframe": '<p><object width="148" height="44"><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=s1OWSxwrHERS&autoplay=0"></param><param name="wmode" value="transparent"></param><embed src="http://vocaroo.com/player.swf?playMediaID=videoID&autoplay=0" width="148" height="44" wmode="transparent" type="application/x-shockwave-flash"></embed></object><br><a href="http://vocaroo.com" style="font-size:xx-small;" title="Vocaroo Voice Recorder">Record music and voice &gt;&gt;</a></p>'
        }        
        
    ]
}

function embutirVideo(link,url,expressao,framewindow){
    log("Embutindo link" + url);

    endereco = url;
    var expressaoRegular = new RegExp(expressao, "g");
    var match = expressaoRegular.exec(endereco);

    if(match) {
        var videoID = match[1];
        var linkRemover = $('<a style="cursor:pointer"> [ - ] Esconder</a>');
        var novoFrame = $(framewindow.replace("videoID", videoID));
        link.after(linkRemover);
        link.hide();
        linkRemover.after(novoFrame);
        linkRemover.click(function() {
            link.show();
            novoFrame.remove();
            linkRemover.remove();
        });

    }
    return true;
}

function verificarLinks(resposta){
  
    resposta.find('.files .fileinfo span.unimportant').each(function(){
        if (!$(this).hasClass("arquivoVerificado")) {
            verificarArquivo($(this));
        }
    });
    
    resposta.find('a[rel="nofollow"]').each(function(){
        if (!apagarLinkSuspeito($(this))){
            embutirLink($(this));
        }
    });
}

function verificarArquivo(fileInfo){
    informacaoArquivo = fileInfo.text();
    
    links.arquivo.forEach(function(arquivo){
        if((informacaoArquivo.indexOf(arquivo.tamanho) !== -1 && informacaoArquivo.indexOf(arquivo.dimensao))
          && (informacaoArquivo.indexOf(arquivo.tamanho) !== -1 && informacaoArquivo.indexOf(arquivo.nome))) {
            var file = $(fileInfo.parent().next('a.file'));
            var linkArquivo = $('<br/><font class="fa fa-exclamation-circle"> [ARQUIVO SUSPEITO] <span class="fa fa-exclamation-circle"></span></font>');
            linkArquivo.attr('color','red');
            linkArquivo.addClass('');
            linkArquivo.css('cursor','pointer');
            linkArquivo.append('<p>Motivo: '+arquivo.motivo +'</p>');
            linkArquivo.append('<p>Clique aqui para abrir (sua conta em risco)</p>');
            linkArquivo.click(function() {
                file.show();
                file.prev().show();
                linkArquivo.remove();
            });
            
            file.prev().hide();
            file.hide();
            linkArquivo.insertAfter(file);
        }
    });
 
    fileInfo.addClass("arquivoVerificado");
}

function apagarLinkSuspeito(link){
    var linkSuspeito = false;

    links.suspeito.forEach(function(value){
        
        if(typeof link.attr('href')=== 'undefined'){
            return true;
        };
        
        if(link.attr('href').indexOf(value.site)!==-1){
            log("Link suspeito" + link.attr('href'));
            link.parent().append('<font color="red" class="fa fa-exclamation-circle"> [URL SUSPEITA. Motivo: '+ value.motivo +'] "' + link.attr('href') + '"</font>');
            link.remove();
            linkSuspeito = true;
            return false;
        };
    });

    return linkSuspeito;
}

function embutirLink(link){
    links.embutir.forEach(function(value){
    
        if(link.hasClass("embutidoPlus")){
            return true;
        };
        
        if(typeof link.attr('href')=== 'undefined'){
            return true;
        };
        

        if(link.attr('href').indexOf(value.site)!==-1){
            log("Embutindo link" + link.attr('href'));

            var linkEmbutir = $('<a style="cursor:pointer"> + [Embutir] </a>');
            link.after(linkEmbutir);

            linkEmbutir.click(function() {
                embutirVideo(linkEmbutir,link.attr('href'),value.expressao,value.iframe);
            });

            link.addClass('embutidoPlus');

        };
    });
    return true;
}


var palavras = [
    {"palavra":"4chan","filtro":"\\/pinto\\/"}
    ,{"palavra":"bananal","filtro":"chernobyl"}
    ,{"palavra":"bolso","filtro":"gibeira"}
    ,{"palavra":"corno","filtro":"corno"}
    ,{"palavra":"cuck","filtro":"corno"}
    ,{"palavra":"cucko","filtro":"cornoo"}
    ,{"palavra":"cuckold","filtro":"cornoold"}
    ,{"palavra":"Dilma","filtro":"Mandioca"}
    ,{"palavra":"direit","filtro":"sonserin"}
    ,{"palavra":"enem","filtro":"bar mitzvah"}
    ,{"palavra":"esquerda","filtro":"grifinoria"}
    ,{"palavra":"esquerd","filtro":"grifinor"}
    ,{"palavra":"filtro","filtro":"marmelo"}
    ,{"palavra":"fio","filtro":"parênquima paliçádico"}
    ,{"palavra":"foda","filtro":"fornicação"}
    ,{"palavra":"fode","filtro":"fornique"}
    ,{"palavra":"foder","filtro":"fornicar"}
    ,{"palavra":"fodeu","filtro":"fornicou"}
    ,{"palavra":"fodi","filtro":"forniquei"}
    ,{"palavra":"bolso","filtro":"gibeira"}
    ,{"palavra":"holocausto","filtro":"festa no apê"}
    ,{"palavra":"rateiem","filtro":"joguem ratos"}
    ,{"palavra":"judeu","filtro":"preto"}
    ,{"palavra":"lula","filtro":"cachaceiro"}
    ,{"palavra":"mara","filtro":"kosher"}
    ,{"palavra":"mcq","filtro":"vocês não conseguem penetrar em meu prolapso tão rápido quanto gostaria"}
    ,{"palavra":"mulher","filtro":"depósito de porra"}
    ,{"palavra":"mulheres","filtro":"depósitos de porra"}
    ,{"palavra":"namorada","filtro":"pitanga"}
    ,{"palavra":"negra","filtro":"frida"}
    ,{"palavra":"negro","filtro":"paixão"}
    ,{"palavra":"negros","filtro":"teutões"}
    ,{"palavra":"olavo","filtro":"bukowski"}
    ,{"palavra":"orkut","filtro":"foro de são paulo"}
    ,{"palavra":"preto","filtro":"judeu"}
    ,{"palavra":"psy","filtro":"batoré"}
    ,{"palavra":"rateiem","filtro":"limpo meu cu com"}
    ,{"palavra":"redpil","filtro":"rivotril"}
    ,{"palavra":"rivotril","filtro":"redpil"}
    ,{"palavra":"sexo","filtro":"dota"}
    ,{"palavra":"trap","filtro":"linguiça"}
    ,{"palavra":"nt:","filtro":"Nesta thread:"}
    ,{"palavra":"itt:","filtro":"Nesta thread:"}

    //essas palavras geram ban automatico
    ,{"palavra":"GIFT BOX"}
    ,{"palavra":"TGIFTBOX"}
    ,{"palavra":"GIFTBOX"}
    ,{"palavra":"facebook"}
    ,{"palavra":"akamaihd"}
    ,{"palavra":"7xp24woty3lxiqrk"}
    ,{"palavra":"0816adadf99018d0544f1d036fe45fa1"}
    ,{"palavra":"pthc"}
    ,{"palavra":"r@ygold"}
    ,{"palavra":"hussyfan"}
    ,{"palavra":"D3751DC1BA"}
    ,{"palavra":"6Vb5cND6"}
    ,{"palavra":"peka"}

];


var ultimaRepostaAlterada = "";
function monitorarFiltroPosts(){
    var ultimoElemento = documento.find("div[id*='thread_']").children(".post").last();

    if (ultimaRepostaAlterada == "") {
        ultimaRepostaAlterada = documento.find("div[id*='thread_']").children(".post").first();
    }

    if (ultimoElemento.is(ultimaRepostaAlterada)){
        return true;
    }

    log("Alterando filtro das palavras a partir da resposta " + ultimaRepostaAlterada.attr('id'));
  
    var liberarReplace = false;
    $('div.post').each(function(){
        
        var repostaParaAlterar = $(this);
        
        if (repostaParaAlterar.is(ultimaRepostaAlterada)){
            liberarReplace= true;
        };
        
        //Evitar que o filtro fique se repetindo nos posts ja filtrados
        if (!liberarReplace){
            return true;
        }
        
        alterarPalavrasPost(repostaParaAlterar);
        verificarLinks(repostaParaAlterar);

    });
    ultimaRepostaAlterada = ultimoElemento;
}

function alterarPalavrasPost(elemento){

    if (elemento.children().length > 0) {
      elemento.children().each(function(){
        alterarPalavrasPost($(this));
      });
    };
    
    elemento.contents().filter(function() {
        return this.nodeType == 3
    }).each(function(){
        var textoAlterado = this.textContent;
        var textoAlterado = textoAlterado.replace(new RegExp('​', "gi"),'');

        palavras.forEach(function(value){
            if (typeof value.filtro !== 'undefined') {
                textoAlterado = textoAlterado.replace(new RegExp(value.filtro, "gi"), value.palavra);
            }
        });

        if(data55Plus.modo != "nenhum"){
          var modoAtivo = modo[data55Plus.modo];
          modoAtivo.filtros.forEach(function(filtro){
            textoAlterado = textoAlterado.replace(new RegExp(filtro.filtro, "gi"), filtro.palavra);
          });          
        }
        
        textoAlterado = alterarTextoModo(textoAlterado);

        this.textContent = textoAlterado;
    });    
}

function alterarPalavrasFormulario(){
    log('Alterando palavras no formulario');
    var textAreaDom = documento.find('textarea[id=body]');
    var textoAlterado = textAreaDom.val();

    palavras.forEach(function(value){
        var tamanhoPalavra = value.palavra.length;
        var palavraMisturada = value.palavra.substring(0, tamanhoPalavra  - 1) + '\u200b' + value.palavra.substring(tamanhoPalavra - 1, tamanhoPalavra);
        

        textoAlterado = textoAlterado.replace(new RegExp(value.palavra, "gi"), palavraMisturada);
        
        if(textAreaDom.val().indexOf(value.palavra) !== -1){
           log('Palavra alterada ' + value.palavra +' -> '+ textoAlterado);
        }

        textAreaDom.val(textoAlterado);
    });
};

function incluirEventoFiltroFormulario(){
    documento.find('#quick-reply,#post-form-inner').find('form').each(function(){
        if (!!!($._data(this, "events"))){
            log('Inlcluindo evento no formulario');
            $(this).on('submit', alterarPalavrasFormulario);
        }
    });

}

function ativarFiltros(){
    monitorarFiltroPosts();
    documento.find('#quick-reply').show();
}


function esconderResposta(linkEsconder){
    linkEsconder.parent().parent().find('div.body').toggle();
    linkEsconder.parent().parent().find('div.files').toggle();
    linkEsconder.parent().parent().find('div.video-container').toggle();
    var replyNo = linkEsconder.prev().text();
    var indexArray = data55Plus.respostasEscondidas.indexOf(replyNo);

    if(linkEsconder.text() == " [ - ] "){
        linkEsconder.text(" [ + ] ");
        if(indexArray  < 0){
            data55Plus.respostasEscondidas.push(replyNo);
            gravarDados();
        };
    } else {
        linkEsconder.text(" [ - ] ");
        if(indexArray  != -1){
            data55Plus.respostasEscondidas.splice(indexArray  , 1);
            gravarDados();
        };
    }

    gravarDados();
}


function inserirLinksEsconderPosts(){
    log("Inserindo links para esconder Posts");
    documento.find("div.post .intro").each(function() {
        var linkNumeroPost = $(this).find('.post_no').last();

        if (linkNumeroPost.hasClass("esconderPlus")){
            return true;
        };

        var linkEsconder = $('<a style="cursor:pointer"> [ - ] </a>');
        linkNumeroPost.after(linkEsconder);

        linkEsconder.attr('id','linkEsconder'+linkEsconder.prev().text());
        linkEsconder.click(function() {
            esconderResposta($(this));
        });

        linkNumeroPost.addClass('esconderPlus');
    });
};

function esconderRespostasAnteriormenteEscondidas(){
    log("Escondendo respostas anteriormente escondidas");
    
    data55Plus.respostasEscondidas.forEach(function(replyNo){
        $('a[id=linkEsconder'+replyNo+']').click();
    });
}

var data55Plus = {"modo":"nenhum","respostasEscondidas":[]};
function lerDados(arrayCallbacks){
    try {
        //sessionStorage.getItem('data55Plus');
        localStorage.getItem('data55Plus');
        
        data55PlusLocalStorage = localStorage.getItem('data55Plus');
    }catch(err){
        console.error("Erro na recuperação dos dados" + err);
    };

    if(data55PlusLocalStorage !== null){
        data55Plus = JSON.parse(data55PlusLocalStorage);
    }

    arrayCallbacks.forEach(function(callback) {
        callback();
    });

}

function gravarDados(){
    /*
    Por um BUG ou burrice dos programadores  Mozilla, para você persistir uma informação no navegador, é necessário que você leia ela depois de salva-la.
    @BUG https://bugs.chromium.org/p/chromium/issues/detail?id=160056
    */
    localStorage.setItem("data55Plus", JSON.stringify(data55Plus));
    localStorage.getItem('data55Plus');
    return true;
}

function downloadVideosYoutube() {
    log('Adicionando links para baixar videos do youtube');

    
    documento.find("div[class=video-container]").each(function(index) {
        var idVideo = $(this).attr("data-video");
        var botaoDownloadVideo = $('<a></a>');
        botaoDownloadVideo.addClass("fa fa-download fa-lg");
        botaoDownloadVideo.attr('href','http://youtubeinmp4.com/youtube.php?video=https://www.youtube.com/watch?v=' + idVideo );
        botaoDownloadVideo.attr('target','_blank');
        botaoDownloadVideo.text(' Baixar em .mp4 ');

        botaoDownloadVideo.insertAfter($(this));
    });
}


var modoAtivado = false;
function ativarModo(){
    
    if((data55Plus.modo == "nenhum") || (modoAtivado)){
        return true;
    };
    
    log(data55Plus.modo + ": on");
    
    var modoAtivo = modo[data55Plus.modo];

    documento.find('.post-image,img').each(function(){
        var dogolaRandom = Math.floor(Math.random() * modoAtivo.qtdImagens) + 1;
        dogolaRandom = ("0000000000"+dogolaRandom ).slice(-modoAtivo.zeros);
        $(this).attr('src', modoAtivo.site + dogolaRandom.toString()+'.jpg');
        $(this).parent('a').attr('href', modoAtivo.site + dogolaRandom.toString()+'.jpg');

    });

    documento.find('body').css('background-image', "url('"+ modoAtivo.site  +"Fundo.jpg')");
    documento.find('.board_image').attr('src', modoAtivo.site +'Banner.jpg');
    
    documento.find('a.file').each(function(){
        var arquivo = $(this);
        var nomeArquivo = arquivo.attr('href');

        if(nomeArquivo.indexOf('.mp4')){

            var novoLink = arquivo.clone();
            novoLink = novoLink.attr('href', modoAtivo.webm[Math.floor(Math.random() * modoAtivo.webm.length)]);
            novoLink.videoAlreadySetUp = false;
            novoLink.insertAfter(arquivo);
            
            
            arquivo.remove();
            try {
                setupVideo(novoLink[0] , novoLink.attr('href'));            
            }catch(err) {
                
                log('Erro no modo a.file' + err.message);
            }

        };
        
    });

    documento.find('.body iframe').each(function(){
        var dogolaRandom = Math.floor(Math.random() * modoAtivo.qtdImagens) + 1;
        dogolaRandom = ("0000000000"+dogolaRandom ).slice(-modoAtivo.zeros);

        var frame = $(this);
        var frameDogolado = $("<img></img>");
        
        frameDogolado.attr('src', modoAtivo.site + dogolaRandom.toString()+'.jpg');
        frameDogolado.attr('width', frame.attr('width'));
        frameDogolado.attr('height', frame.attr('height'));
        frameDogolado.attr('href', modoAtivo.webm[Math.floor(Math.random() * modoAtivo.webm.length)]);
        
        frameDogolado.insertAfter(frame);
        frame.remove();
        
        
        try {
            setupVideo(frameDogolado[0] , frameDogolado.attr('href'));            
        }catch(err) {
            
            log('Erro na no modo iframe ' + err.message);
        }
    });
    
    modoAtivado = true;
};


var modo = {
    "mododogola" : {
      "site" : "https://sites.google.com/site/dogolaplus/home/dogola",
      "qtdImagens" : "24",
      "zeros" : "4",
      "webm" : ["http://webm.land/media/qHwa.webm"],
      "filtros" : [{"filtro":"mulher", "palavra":"merdalher"},{"filtro":"esquerda", "palavra":"mortadela"}],
      "palavras" : ["dogola"]
    },
      "mododilma" : {
      "site" : "https://sites.google.com/site/dilmagolpe/home/golpe",
      "qtdImagens" : "16",
      "zeros" : "5",
      "webm" : ["http://webm.land/media/qHwa.webm"],
      "filtros" : [{"filtro" : "mulher",     "palavra": "companheira"}
                  ,{"filtro": "esquerda",   "palavra": "democracia"}
                  ,{"filtro": "direita",    "palavra" : "GOLPISTA"}
                  ,{"filtro" : "presidente", "palavra": "GOLPISTA"}
                  ,{"filtro" : "president", "palavra": "GOLPISTA"}],
      "palavras" : ["golpe","golpista","comunista","coxinha","PT","Lula","companheiro","companheira","Dilma","CUT","MST"]
    }
};

function ativarAtalhosTeclado(){
    var teclaDigitada = "";
    var tempoApagar = new Date().getTime();
    
   documento.keydown(function(e) {

        if(new Date().getTime() - tempoApagar > 30000){
            teclaDigitada = "";
            tempoApagar = new Date().getTime();
        }

        teclaDigitada += String.fromCharCode(e.keyCode).toLowerCase();
        
        $.each(modo, function(key,val) {
          if((teclaDigitada.toString().indexOf(key) !== -1)){
            teclaDigitada = "";
            modoAtivado = false;
            data55Plus.modo = key;
            gravarDados();
            log('Ativar modo: ' + key);
            ativarModo();
            ultimaRepostaAlterada = "";
            monitorarFiltroPosts();
          }
        });
        
        if((teclaDigitada.toString().indexOf("desligamodo") !== -1)){
          log("Desliga Modo");
          data55Plus.modo = "nenhum";
          gravarDados();
          location.reload();
        }
        
        if((teclaDigitada.toString().indexOf("limpardados") !== -1)){
          log("limpandoDados");
          localStorage.removeItem('data55Plus');
          location.reload();
        }

    });
}

var pularPalavra = [
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
function alterarTextoModo(textoAntigo){
  
    if(data55Plus.modo != "nenhum"){
        var novoTexto = "";
        var palavraPulada = false;
        var modoAtivo = modo[data55Plus.modo];
        textoAntigo.split(/\s+/i).forEach(function(palavra, indice) {

            if(pularPalavra.indexOf(palavra.toLowerCase()) !== -1){
                palavraPulada = true;
                novoTexto += ' ' + palavra;
                return true;
            } else if (palavraPulada){
                var novaPalavra = modoAtivo.palavras[Math.floor(Math.random() * modoAtivo.palavras.length)];
                if(palavra == palavra.toUpperCase()){
                  novaPalavra = novaPalavra.toUpperCase();
                }
                novoTexto += ' ' + novaPalavra + ' ';
                palavraPulada = false;
                return true;                        
            }
            
            if((indice != 0) && (indice % 5 == 0)){
                novoTexto += ' ' + palavra;
            } else {
                novoTexto += ' ' + palavra;
            }
            
            

        });        
            textoAntigo = novoTexto;
    };
    
    return textoAntigo;
};

function menuReportarPostagem(){
 documento.find("div.post.reply").each(function(){
   var replyId = getPostagemId(this);
   $(this).find("p.intro a.post_no").eq(1).after('<a href="javascript:reportarPostagem('+replyId+')" title="Reportar Thread"><i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i></a>');
 }); 
}

function reportarPostagem(id){
  var motivo = prompt("Informe o motivo do report.","");
  if(motivo !== null){
    try{
      var post = String("{\"delete_"+id+"\": \"\", \"password\" : \""+$("#password").val()+"\", \"board\": \""+getThread()+"\", \"reason\":\""+motivo+"\",\"report\":\"Denunciar\"}");
      
    $.post('/altpost.php', JSON.parse(post), function(){
      alert("Postagem reportada com sucesso.")
    });
    
    }catch(err){
      console.error("Erro ao reportar postagem: " + err);
    }
    
  }
}

function criarJanelaIRC(){
    log('Criando a janela de IRC');
    if($('body').find('div#chatIRC').length > 0){
      return true;
    }
    
    var janelaIRC = $('<iframe></iframe>');
    janelaIRC.attr('src','https://qchat.rizon.net/?randomnick=1&channels=55chan&prompt=1&uio=MT1mYWxzZSYxNj10cnVlJjExPTE3NA66');
    janelaIRC.css({'minHeight':'350px','minWidth':'650px', 'width':'100%','height':'100%'});
    
    
    var divJanelaIRC = $('<div id="chatIRC" style="cursor:pointer; font-family:sans-serif;"><i class="fa fa-weixin" aria-hidden="true"></i> Chat 55 </div>');
    divJanelaIRC.css({'background-color':'#EDFCFF'});
    
    divJanelaIRC.css({'position': 'fixed',
                       'right': '0',
                       'bottom': '20px'
    });
    var botaoAbrir = $('<button> [+] Mostrar </button></br>');
    botaoAbrir.click(function() {
      divJanelaIRC.append(janelaIRC);
      divJanelaIRC.css({'minHeight':'350px','minWidth':'650px'});
      botaoFechar.show();
      botaoAbrir.hide();
    });
    
    
    var botaoFechar = $('<a> [-] Esconder </a></br>');
    botaoFechar.click(function() {
      janelaIRC.remove();
      divJanelaIRC.css({'minHeight':'0','minWidth':'0'});
      botaoFechar.hide();
      botaoAbrir.show();      
    });
    
    
    divJanelaIRC.append(botaoFechar);
    divJanelaIRC.append(botaoAbrir);
    botaoFechar.hide();

    
    $('body').append(divJanelaIRC);

};

function inserirLinkCatalogo(){
  log('Criando barra de opcoes');
  var caminho = window.location.pathname;
  var expressaoRegular = new RegExp('/[\\w\\d]+/', "g");
  var board = expressaoRegular.exec(caminho);

  var novoLink = $('<a href="'+board+'catalog.html" > [CATÁLOGO] </a>');
  novoLink.css({'float':'right','padding-right': '10px'});
  
  
  novoLink.insertAfter(documento.find('a[title="Opções"]'));
}

