(function(){
  // Busca na pagina inicial
  var busca=document.getElementById('busca');
  if(busca){
    var cards=[].slice.call(document.querySelectorAll('#indice .card'));
    var vazio=document.getElementById('vazio');
    busca.addEventListener('input',function(){
      var q=busca.value.trim().toLowerCase(),n=0;
      cards.forEach(function(c){var ok=!q||c.dataset.busca.indexOf(q)>-1;c.style.display=ok?'':'none';if(ok)n++;});
      vazio.hidden=n>0;
    });
  }
  // Visualizador nas paginas de evento
  var m=document.getElementById('mosaico');
  if(!m)return;
  var WA='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';
  var DL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a1 1 0 0 1 1 1v9.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4l3.3 3.3V4a1 1 0 0 1 1-1zM5 19h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2z"/></svg>';
  var base=m.dataset.url, textoWa=m.dataset.wa;
  function linkWa(i){return 'https://wa.me/?text='+encodeURIComponent(textoWa+' '+base+'#'+(i+1));}
  var links=[].slice.call(m.querySelectorAll('a.foto'));
  links.forEach(function(a,i){
    var w=document.createElement('a');w.className='wa';w.href=linkWa(i);w.target='_blank';w.rel='noopener';
    w.title='Compartilhar no WhatsApp';w.setAttribute('aria-label','Compartilhar no WhatsApp');w.innerHTML=WA;
    a.parentNode.appendChild(w);
  });
  var lb=document.createElement('div');lb.className='lb';
  lb.innerHTML='<button class="fechar" aria-label="Fechar">&times;</button><button class="ant" aria-label="Anterior">&#8249;</button><img alt=""><button class="prox" aria-label="Próxima">&#8250;</button><div class="acoes"><div class="botoes"><a class="btn-wa" target="_blank" rel="noopener">'+WA+'Compartilhar no WhatsApp</a><a class="btn-dl" download>'+DL+'Baixar foto</a></div><div class="info"></div></div>';
  document.body.appendChild(lb);
  var img=lb.querySelector('img'),info=lb.querySelector('.info'),bw=lb.querySelector('.btn-wa'),bd=lb.querySelector('.btn-dl'),atual=0;
  function mostrar(i){
    atual=(i+links.length)%links.length;
    var href=links[atual].getAttribute('href');
    img.src=href;
    bw.href=linkWa(atual);
    var ext=(href.match(/\.[a-z0-9]+$/i)||['.jpg'])[0].toLowerCase();
    bd.href=href; bd.setAttribute('download','VcNaFoto-evento-'+m.dataset.num+'-foto-'+(atual+1)+ext);
    var arq=decodeURIComponent(href);
    var assunto=encodeURIComponent('Pedido de remoção - evento '+m.dataset.num+' - '+arq);
    info.innerHTML=(atual+1)+' / '+links.length+' &middot; <a href="mailto:'+m.dataset.email+'?subject='+assunto+'">Solicitar remoção desta foto</a>';
    [1,-1].forEach(function(d){var p=new Image();p.src=links[(atual+d+links.length)%links.length].getAttribute('href');});
    history.replaceState(null,'','#'+(atual+1));
  }
  function abrir(i){lb.classList.add('on');document.body.style.overflow='hidden';mostrar(i);}
  function fechar(){lb.classList.remove('on');document.body.style.overflow='';history.replaceState(null,'',location.pathname);}
  links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();abrir(i);});});
  lb.querySelector('.fechar').onclick=fechar;
  lb.querySelector('.ant').onclick=function(e){e.stopPropagation();mostrar(atual-1);};
  lb.querySelector('.prox').onclick=function(e){e.stopPropagation();mostrar(atual+1);};
  lb.addEventListener('click',function(e){if(e.target===lb)fechar();});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('on'))return;
    if(e.key==='Escape')fechar();else if(e.key==='ArrowLeft')mostrar(atual-1);else if(e.key==='ArrowRight')mostrar(atual+1);
  });
  var x0=null;
  lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)mostrar(atual+(dx<0?1:-1));x0=null;});
  // Link direto para uma foto: .../12/#5 (e o que o WhatsApp abre)
  var h=parseInt(location.hash.slice(1),10);if(h>0&&h<=links.length)abrir(h-1);
})();
