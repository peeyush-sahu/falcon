let DetectTextResponse = class {
    constructor(detectedText, cardNumber, expiryDate) {
        this.detectedText = detectedText
        this.cardNumber = cardNumber
        this.expiryDate = expiryDate
    }
    getDetectedText() {
        return this.detectedText
    }
    getCardNumber() {
        return this.cardNumber
    }
    getExpiryDate() {
        return this.expiryDate
    }
    setDetectedText(val){
        this.detectedText = val
    }
    setCardNumber(val) {
        this.cardNumber = val
    }
    setExpiryDate(val) {
        this.expiryDate = val
    }
}
 
export default DetectTextResponse