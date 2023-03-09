import axios from "axios";
import DetectTextConfig from "../config/prod.env.js";
import DetectTextException from "../models/custom-exception.js";
import requestData from "../dtos/request-dto.js";

// initialize and create new class
let detectTextConfig = new DetectTextConfig(
  "https://vision.googleapis.com/v1/"
);

const api = axios.create({
  baseURL: detectTextConfig.getBaseURL(),
});

// Detect text in images
async function detectTextFromImage(requestImageFile) {
  let detectTextRequestData = requestData;

  // add the base64 image to the request body
  detectTextRequestData.requests[0].image.content = requestImageFile;

  // Check if we have an API kEY added for the Vision OCR and Detect Text API
  if (
    !detectTextConfig.getAPIKey() ||
    detectTextConfig.getAPIKey() == undefined ||
    detectTextConfig.getAPIKey() == null
  ) {
    throw new DetectTextException("No API Key provided to perform operation");
  }

  const response = await api.post(
    "images:annotate?key=" + detectTextConfig.getAPIKey(),
    detectTextRequestData
  );
  return response;
}

/*
    This is the function used to set the api key for the OCR/ detect functions
 */
async function setAPISecretKey(apiKey) {
  detectTextConfig.setAPIKey(apiKey);
}

export default {
  detectTextFromImage: (data) => detectTextFromImage(data),
  setAPISecretKey: (data) => setAPISecretKey(data),
};
