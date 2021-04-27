import { log, error } from './util.ts'

type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn'

type USLocale = 'en_US' | 'es_MX' | 'pt_BR'
type EULocale = 'en_GB' | 'es_ES' | 'fr_FR' | 'ru_RU' | 'de_DE' | 'pt_PT' | 'it_IT'
type KRLocale = 'ko_KR'
type TWLocale = 'zh_TW'
type CNLocale = 'zh_CN'

type Locale = USLocale | EULocale | KRLocale | TWLocale | CNLocale

let config: {
    region: Region,
    locale: Locale,
    token: string,
    tokenReceivedAt: number,
    tokenExpiresAt: number
}

export async function auth(key: string, secret: string, region: Region, locale: Locale): Promise<boolean> {
    const uri = region == 'cn'
        ? 'https://www.battlenet.com.cn/oauth/token'
        : `https://${region}.battle.net/oauth/token`

    const response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${key}:${secret}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    })

    if (response.ok) {
        const data = await response.json()
        config = {
            region,
            locale,
            token: data.access_token,
            tokenReceivedAt: Date.now(),
            tokenExpiresAt: Date.now() + data.expires_in * 1000
        }
        log('Auth successful')
        return true
    } else {
        error('Auth failed:', response.status, response.statusText)
        return false
    }
}

// deno-lint-ignore no-explicit-any
async function request(url: string, args: { [_: string]: string }, retryForTooManyRequests = true): Promise<any> {
    const euc = encodeURIComponent
    const query = Object.keys(args).reduce((a, k, i) => a + (i == 0 ? '?' : '&') + euc(k) + '=' + euc(args[k]), '')
    const response = await fetch(url + query)

    if (response.ok) {
        log(url)
        return await response.json()
    } else {
        error('Request failed:', response.status, response.statusText, url)
        if (response.status == 429 && retryForTooManyRequests) {
            log('Retrying soon...')
            await new Promise(r => setTimeout(r, 5000))
            return await request(url, args, false)
        } else {
            return false
        }
    }
}

export async function get(service: string, args: { [_: string]: string }) {
    if (args.namespace) {
        args.namespace += `-${config.region}`
    }

    args.locale = config.locale
    args.access_token = config.token

    const host = config.region == 'cn'
        ? 'https://gateway.battlenet.com.cn/'
        : `https://${config.region}.api.blizzard.com/`

    return await request(host + service, args)
}
