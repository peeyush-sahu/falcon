import DetectTextException from '../models/custom-exception'
import DetectTextResponse from '../models/detect-text-response'

// store the regexes here
const numberWithSpacesRegex_version_1 = /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)/gm
const numberWithSpacesRegex_version_2 = /\b(\s*[0-9]+\s*)\b/
const numberWithSpacesRegexMatch_version_1 = /\\b(\\d{4}[- ]?){4}/
const numberWithSpacesRegexMatch_version_2 = /\b(\d{4}[- ]?){4}/

const replaceExpiryCardRegex = /[^\d/\///\/]/g
const trimEmptySpaceRegex = /\s+/g

// Check pattern for expiry data
const moreThan3DigitsPattern = /(?:\d.*?){3,7}/
const moreThan3DigitsPattern_2 = /(.*?\\d){3,7}/

// NB Replace all the [0-9] below here with [1-9]
const expiryDatePattern = /^(0[0-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/
// using word boundaries
const expiryDatePattern_2 = /\b(0[0-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/ // these are outliers
const expiryDatePattern_3 = /^(0[0-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})$)/
const expiryDatePattern_4 = /\b(0[0-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})\b)/ // these are outliers

/*
*   From the detected text Check if we can get the Card Number
*/
function getCardNumberFromDetectedText (detectedText) {
    let result = -1

    // loop through the detected text and get the card number
    for( let index in detectedText ) {
        let element = detectedText[index]

        // to check if string contains digits with spaces but 12 characters or more
        if(element.length >= 12) {
            // calculation using ratio // this will minimise the number of elements we will have to loop through
            let cardNumberResRatio = checkForPossibleCardNumberUsingRatio(element)

            // has the element met the ratio criteria
            if(cardNumberResRatio && cardNumberResRatio != -1) {
                try {
                    // calculation using first regex test
                    let cardNumberResTestReg1 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegex_version_1, false)

                    // working code for check credit card numbers using regex test 1
                    if(cardNumberResTestReg1 && cardNumberResTestReg1 != -1) {
                        result = index
                        return result
                        break
                    }else{
                        // calculation using first regex match
                        let cardNumberResMatchReg1 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegexMatch_version_1, false)

                        // calculation using second regex match
                        let cardNumberResMatchReg2 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegexMatch_version_2, false)

                        if((cardNumberResMatchReg1 &&  cardNumberResMatchReg1 != -1) || (cardNumberResMatchReg2 &&  cardNumberResMatchReg2 != -1)) {
                            result = index
                            return result
                            break
                        }else{
                            // working code for check credit card numbers using regex test 2
                            let cardNumberResTestReg2 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegex_version_2, false)
                            if(cardNumberResTestReg2 &&  cardNumberResTestReg2 != -1) {
                                result = index
                                return result
                                break
                            }
                        }
                    }
                } catch(e){
                    // an exception doing the match for the elements
                    result = -1
                }
            }
        }
    }
    return result
}

/*
*   From the detected text Check if we can get the Expiry Date
*/
function getExpiryDateFromDetectedText (detectedText) {
    let result = -1
    // loop through the detected text and get the card number
    for( let index in detectedText ) {
        let element = detectedText[index]

        // to check if string contains digits 3 to 7 characters
        if((moreThan3DigitsPattern.test(element) || moreThan3DigitsPattern_2.test(element)) && element.indexOf("/") != -1) {
            // Check for Expiry Date using Regexes
            if(expiryDatePattern.test(element)){
                result = index
                return result
                break
            }

            if(expiryDatePattern_2.test(element)){
                result = index
                return result
                break
            }

            if(expiryDatePattern_3.test(element)){
                result = index
                return result
                break
            }

            if(expiryDatePattern_4.test(element)){
                result = index
                return result
                break
            }
        }
    }
    return result
}

/*
*   Format the Detected Text to Return the detected Text, Credit Card Number and Credit Card Expiry Date
*/
function formatDetectedText(responseData) {
    const detectedTextResponse = responseData.responses[0] // get the first index response

    if(!detectedTextResponse){
        throw new DetectTextException("Could not perform operation")
    }

    // we have all the descriptions from textAnnotations
    const annotationResult = detectedTextResponse.textAnnotations

    // this is the text annotation
    let textAnnotationsDesc= annotationResult[0].description ? annotationResult[0].description : null

    // this is the full text annotation
    let fullTextAnnotationsDesc = detectedTextResponse.fullTextAnnotation.text ? detectedTextResponse.fullTextAnnotation.text : null

    // just do operations on one of the above results
    // format the text to extract details

    let detectedText = null

    if(fullTextAnnotationsDesc) {
        detectedText = fullTextAnnotationsDesc.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/)
    }else{
        if(textAnnotationsDesc) {
            detectedText = textAnnotationsDesc.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/)
        }
    }

    // if the formatted/detected text is null
    if(!detectedText || detectedText == null || detectedText == undefined){
        throw new DetectTextException("Could not perform operation")
    }

    // set the unformatted detected text response
    const notFormattedDetectedTextResponse = detectedText

    // Create the detect response object
    let extractedCardNumber = null
    let extractedExpiryDate = null
    let response  = new DetectTextResponse(
        notFormattedDetectedTextResponse, extractedCardNumber, extractedExpiryDate
    )

    // set the detected text response
    response.setDetectedText(notFormattedDetectedTextResponse)

    // get the card number
    let cardNumberIndex = getCardNumberFromDetectedText(detectedText)
    if(cardNumberIndex && cardNumberIndex != -1) {
        extractedCardNumber = detectedText[cardNumberIndex]
        detectedText.splice(cardNumberIndex, 1)  // remove this element from the array
    }

    // get the expiry dates
    let expiryDateIndex = getExpiryDateFromDetectedText(detectedText)
    if(expiryDateIndex && expiryDateIndex != -1) {
        extractedExpiryDate = detectedText[expiryDateIndex]

        // Replace all non digit characters
        extractedExpiryDate = extractedExpiryDate.replace(replaceExpiryCardRegex, '')
        // trim all the empty spaces
        extractedExpiryDate = extractedExpiryDate.replace(trimEmptySpaceRegex, '')
        detectedText.splice(expiryDateIndex, 1)  // remove this element from the array
    }

    // set object data
    response.setCardNumber(extractedCardNumber)
    response.setExpiryDate(extractedExpiryDate) // set object data

    return response
}

// Check if the string passed is a possible Credit Number
// Using Regular Expressions
function checkForPossibleCardNumberUsingRegex(str, cardNumberRegex, isMatch) {
    let result = -1
    if(isMatch) {
        if(str.match(cardNumberRegex)) {
            result = str
        }
    } else {
        if(cardNumberRegex.test(str)) {
            result = str
        }
    }

    return result
}

// Check if the string passed is a possible Credit Number
// Using Calculations of the possible digits to character ratio
function checkForPossibleCardNumberUsingRatio(str) {
    let result = -1

    // trim the string of empty spaces
    const trimmedString = str.replace(trimEmptySpaceRegex, '') // && str.replace(" ", "")

    let numbersRatio = (findTotalCount(trimmedString) / trimmedString.length) * 100

    if(parseFloat(numbersRatio) > parseFloat(80.0)) {
        result = str
    }
    return result
}

function findTotalCount(str) {
    let digitsArr = str.match(/\d+/g)
    // let digitsArr = str.replace(/[^0-9]/g, '').length;
    if (digitsArr) {
        return digitsArr.join("").length
    }
    return 0
}

//  function to check if its an image file
function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}

// function to check allowed file extensions
function isAllowedImageExtensions(file) {
    const acceptedImageTypes = ['image/x-png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/jpeg', 'image/png'];

    return file && acceptedImageTypes.includes(file['type'])
}

// get the base64 image from the image file to post to the Vision Detect Text API
// function to encode file data to base64 encoded string
const getBase64FromImage = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// from the base64 image get the data to post to the Vision Detect Text API
function getDataFromBase64Image(filebase64Object) {
    return filebase64Object.substring(filebase64Object.indexOf("base64,") + 7)
}

export default {
    getCardNumberFromDetectedText: (data) => getCardNumberFromDetectedText(data),
    getExpiryDateFromDetectedText: (data) => getExpiryDateFromDetectedText(data),
    formatDetectedText: (data) => formatDetectedText(data),
    isFileImage: (data) => isFileImage(data),
    isAllowedImageExtensions: (data) => isAllowedImageExtensions(data),
    getBase64FromImage: (data) => getBase64FromImage(data),
    getDataFromBase64Image: (data) => getDataFromBase64Image(data)
}
