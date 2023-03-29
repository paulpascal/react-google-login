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

  const handleSigninSuccess = function handleSigninSuccess(credentialResponse) {
    const credentialToken = credentialResponse.credential

    const payloadData = jwt_decode(credentialToken)

    const response = {}

    response.profileObj = {
      googleId: payloadData.sub,

      imageUrl: payloadData.picture,

      email: payloadData.email,

      name: payloadData.name,
      givenName: payloadData.given_name,
      familyName: payloadData.family_name
    }

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
      window.google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed() && ['opt_out_or_no_session'].includes(notification.getNotDisplayedReason())) {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,

            scope,

            callback(tokenResponse) {
              window.google.accounts.id.initialize({
                client_id: clientId,

                itp_support: true,
                auto_select: true,

                callback: handleSigninSuccess
              })

              window.google.accounts.id.prompt()
            }
          })

          client.requestAccessToken()
        } else if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment() ||
          ['user_cancel', 'issuing_failed'].includes(notification.getSkippedReason())
        ) {
          document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
          window.google.accounts.id.cancel()
        }
      })
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

            itp_support: true,

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

      document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
      window.google.accounts.id.cancel()

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
