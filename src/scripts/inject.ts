XMLHttpRequest = new Proxy( XMLHttpRequest, {
	construct( target ) {
		const xhr: any = new target();

		( (
			open,
			setRequestHeader,
			send,
			onreadystatechange
		) => {
			xhr.open = function () {
				const [ method, url, async, user, password ] = [ ...arguments ];

				xhr.openArgs = {
					method,
					url,
					async,
					user,
					password
				};

				return open.apply( this, arguments );
			};
			xhr.setRequestHeader = function () {
				const [ header, value ] = [ ...arguments ];

				if ( ! xhr.requestHeaders ) xhr.requestHeaders = {};

				xhr.requestHeaders[ header ] = value;

				return setRequestHeader.apply( this, arguments );
			};
			xhr.send = function () {
				const [ body ] = [ ...arguments ];

				xhr.sendArgs = {
					body
				}

				xhr.onreadystatechange = function () {
					const [ event ] 			= [ ...arguments ];

					const responseHeadersRAW 	= xhr.getAllResponseHeaders();

					if ( '' != responseHeadersRAW ) {
						const responseHeaders = responseHeadersRAW.split( "\r\n" ).filter( ( row: any ) => row ).map( ( row: any ) => {
							const split 		= row.split( ': ' );
							const name 			= split[ 0 ];
							const value 		= split[ 1 ].trim();
							const header: any 	= {};

							header[ name ] = value;
							return header;
						} ).reduce( ( acc: any, next: any ) => {
							return Object.assign( acc, next );
						} );

						xhr.responseHeaders = responseHeaders;
					}

					if ( 200 === xhr.status && 4 === xhr.readyState ) {
						const url 				= new URL( xhr.responseURL );

						xhr.capturedResponse 	= {
							url
						};

						try {
							const responseJSON 		= JSON.parse( xhr.response );

							xhr.capturedResponse[ 'responseJSON' ] = responseJSON;
						} catch ( error ) {}
					}

					return onreadystatechange ? onreadystatechange.apply( this, arguments ) : true;
				};

				return send.apply( this, arguments );
			};
		} )(
			xhr.open,
			xhr.setRequestHeader,
			xhr.send,
			xhr.onreadystatechange,
		);

		return xhr;
	}
} );

const options = {
	childList				: true,
	subtree					: true,
	characterData			: true,
	attributes				: true,
};

const observer = new MutationObserver( records => {
	const found = records.find( ( record: any ) => record.target.id && 'app' === record.target.id );

	if ( found ) {
		// TODO: you moves
	}
} );

observer.observe( document.body, options );