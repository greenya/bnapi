import { trace, error } from './util.ts'

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
        trace('Auth successful', config)
        return true
    } else {
        error('Auth failed', response)
        return false
    }
}