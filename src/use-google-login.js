/* eslint-disable no-unused-vars */

import jwt_decode from 'jwt-decode'

import { useState, useEffect } from 'react'
import loadScript from './load-script'
import removeScript from './remove-script'

const useGoogleLogin = ({
  onSuccess = () => {},
  onAutoLoadFinished = () => {},
  onFailure = () => {},
  onRequest = () => {},
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
  jsSrc = 'https://accounts.google.com/gsi/client',
  prompt
}) => {
  const [loaded, setLoaded] = useState(false)

  const handleSigninSuccess = function handleSigninSuccess(response) {
    const credentialToken = response.credential

    const payloadData = jwt_decode(credentialToken)

    response.profileObj = {
      googleId: payloadData.sub,

      imageUrl: payloadData.picture,

      email: payloadData.email,

      name: payloadData.name,
      givenName: payloadData.given_name,
      familyName: payloadData.family_name
    }

    /*
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,

      prompt: 'none',
      hint: payloadData.email,
      scope,

      callback(tokenResponse) {
        response.tokenObj = {
          id_token: tokenResponse.access_token
        }

        onSuccess(response)
      }
    })

    client.requestAccessToken()
    */

    response.tokenObj = {
      id_token: credentialToken
    }

    onSuccess(response)
  }

  const signIn = function signIn(event) {
    if (event) {
      // to prevent submit if used within form
      event.preventDefault()
    }

    if (loaded) {
      window.google.accounts.id.prompt(notification => {})
    }
  }

  useEffect(() => {
    let unmounted = false

    const onLoadFailure = onScriptLoadFailure || onFailure

    loadScript(
      document,

      'script',

      'google-login',

      jsSrc,

      () => {
        window.onload = () => {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleSigninSuccess
          })

          setLoaded(true)
        }
      },
      error => {
        onLoadFailure(error)
      }
    )

    return () => {
      unmounted = true

      removeScript(document, 'google-login')
    }
  }, [])

  useEffect(() => {
    if (autoLoad) {
      signIn()
    }
  }, [loaded])

  return { signIn, loaded }
}

export default useGoogleLogin
