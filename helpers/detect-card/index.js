import DetectTextException from "./models/custom-exception";
import DetectTextFunctions from "./utils/detect-text-common-functions";
import detectTextApi from "./utils/detectTextAPI.js";

/*
    This is the function to get the detected text from the image uploaded
 */
async function getCardDetails(fileObject) {
  let imageFile = fileObject; // initialize the image to null

  // do we have an image file???
  if (imageFile) {
    //  call the Google Vision Detect Text API
    try {
      const response = await detectTextApi.detectTextFromImage(imageFile);

      const responseData = DetectTextFunctions.formatDetectedText(
        response.data
      );

      return responseData;
    } catch (error) {
      // The default message to return
      let message = "Could not complete detect operation on image";

      // Check if the error is a {DetectTextException} from detectTextAPI
      if (error.name == "DetectTextException" && error.errorMessage) {
        message = error.errorMessage;
      } else {
        if (error.response.data.error.message) {
          message = error.response.data.error.message;
        } else {
          message = error.message;
        }
      }
      throw new DetectTextException(message.toString());
    }
  } else {
    throw new DetectTextException("No file was found to perform operation");
  }
}

/*
    This is the function used to set the api key for the OCR/ detect functions
 */
async function setAPISecret(apiKey) {
  await detectTextApi.setAPISecretKey(apiKey);
}

// a list of exported variables
export { getCardDetails, setAPISecret };
