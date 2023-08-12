import * as crypto from "crypto-js"
import oauth1a from 'oauth-1.0a';

/**
 * Helper function that builds the Oauth1.0 header from the request object (url + method)
 * https://oauth.net/core/1.0a/
 * @param request the request object (url + method) for the API call we're authenticating for
 */
export const getAuthHeader = (request: any) => {
    // @ts-ignore
    const oauth = oauth1a({
        consumer: { key: import.meta.env.REACT_APP_CONSUMER_KEY, secret: import.meta.env.REACT_APP_CONSUMER_SECRET },
        signature_method: 'HMAC-SHA1',
        hash_function: hash_function_sha1
    });

    const authorization = oauth.authorize(request, {
        key: import.meta.env.REACT_APP_TOKEN_VALUE,
        secret: import.meta.env.REACT_APP_TOKEN_SECRET,
    });

    return oauth.toHeader(authorization);
}

/**
 * Helper function that SHA1 hashes the oauth signature
 * @param base_string
 * @param key
 */
const hash_function_sha1 = (base_string: string, key: string) => {
    return crypto.HmacSHA1(base_string, key).toString(crypto.enc.Base64);
}