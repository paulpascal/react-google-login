
import { useState, useEffect } from "react"
import loadScript from "./load-script"
import removeScript from "./remove-script"

const useGoogleLogin = (
	(
		{
			onSuccess = ( ) => { },
			onAutoLoadFinished = ( ) => {},
			onFailure = ( ) => { },
			onRequest = ( ) => { },
			onScriptLoadFailure,
			clientId,
			cookiePolicy,
			loginHint,
			hostedDomain,
			autoLoad,
			isSignedIn,
			fetchBasicProfile,
			redirectUri,
			discoveryDocs,
			uxMode,
			scope,
			accessType,
			responseType,
			jsSrc = "https://accounts.google.com/gsi/client",
			prompt
		}
	) => {
		const [ loaded, setLoaded ] = (
			useState( false )
		);

		const handleSigninSuccess = (
			function handleSigninSuccess( response ){
				onSuccess( response );
			}
		)

		const signIn = (
			function signIn( event ){
				if(
					event
				){
					// to prevent submit if used within form
					event.preventDefault( );
				}

				if(
					loaded
				){
				}
			}
		);

		useEffect(
			(
				( ) => {
					let unmounted = (
						false
					);

					const onLoadFailure = (
							onScriptLoadFailure
						||
							onFailure
					);

					loadScript(
						document,

						"script",

						"google-login",

						jsSrc,

						(
							( ) => {
								window.onload(
									function( ){
										google.accounts.id.initialize(
											{
												client_id: clientId,
												callback: handleSigninSuccess
											}
										);
									}
								);
							}
						),

						(
							( error ) => {
								onLoadFailure( error );
							}
						)
					);

					return	(
								( ) => {
									unmounted = (
										true
									);

									removeScript( document, "google-login" );
								}
							)
				}
			),

			(
				[ ]
			)
		);

		useEffect(
			(
				( ) => {
					if(
						autoLoad
					){
						signIn( );
					}
				}
			),

			(
				[
					loaded
				]
			)
		);

		return	(
					{
						signIn,
						loaded
					}
				);
	}
);

export default useGoogleLogin;
