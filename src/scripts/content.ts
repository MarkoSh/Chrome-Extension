const s: HTMLScriptElement	= document.createElement( 'script' );
s.src 						= chrome.runtime.getURL( 'scripts/inject.js' );
s.defer						= true;
s.onload 					= () => s.remove();
( document.head || document.documentElement ).append( s );