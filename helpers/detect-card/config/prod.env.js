let DetectTextConfig = class {
    constructor(baseURL) {
        this.baseURL = baseURL
        this.apiKey = null
    }

    getBaseURL() {
        return this.baseURL
    }

    setBaseURL(val){
        this.baseURL = val
    }

    getAPIKey() {
        return this.apiKey
    }

    setAPIKey(val) {
        this.apiKey = val
    }
}

export default DetectTextConfig
