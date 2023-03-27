
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
				const credentialToken = (
					response.credential
				);

				const payloadData = ( { } );

				response.profileObj = (
					{
						"googleId": payloadData.sub,

						"imageUrl": payloadData.picture,

						"email": payloadData.email,

						"name": payloadData.name,
						"givenName": payloadData.given_name,
						"familyName": payloadData.family_name
					}
				);

				response.tokenObj = ( { } );

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
					google.accounts.id.prompt(
						(
							( notification ) => {

							}
						)
					);
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

										/*
										google.accounts.oauth2.initCodeClient(
											{
												client_id: clientId,

												prompt: "select_account",
												scope: scope,

												callback: handleSigninSuccess
											}
										);
										*/
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
