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
  var links=[].slice.call(m.querySelectorAll('a.cel'));
  var lb=document.createElement('div');lb.className='lb';
  lb.innerHTML='<button class="fechar" aria-label="Fechar">&times;</button><button class="ant" aria-label="Anterior">&#8249;</button><img alt=""><button class="prox" aria-label="Próxima">&#8250;</button><div class="info"></div>';
  document.body.appendChild(lb);
  var img=lb.querySelector('img'),info=lb.querySelector('.info'),atual=0;
  function mostrar(i){
    atual=(i+links.length)%links.length;
    var href=links[atual].getAttribute('href');
    img.src=href;
    var arq=decodeURIComponent(href);
    var assunto=encodeURIComponent('Pedido de remoção - evento '+m.dataset.num+' - '+arq);
    info.innerHTML=(atual+1)+' / '+links.length+' <a href="mailto:'+m.dataset.email+'?subject='+assunto+'">Solicitar remoção desta foto</a>';
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
  // Link direto para uma foto: .../12/#5
  var h=parseInt(location.hash.slice(1),10);if(h>0&&h<=links.length)abrir(h-1);
})();
