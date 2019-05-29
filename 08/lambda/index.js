const Alexa = require('ask-sdk-core');

// i18n dependency
const i18n = require('i18next');
const util = require('./util');

// We create a language strings object containing all of our strings.
// The keys for each string will then be referenced in our code
// e.g. handlerInput.t('WELCOME_MSG')
const languageStrings = {
    en: {
      translation: {
        WELCOME_MSG: 'Welcome, you can say Hello or Help. Which would you like to try?',
        HELLO_MSG: 'Hello Multimodal!',
        HELP_MSG: 'You can say hello to me! How can I help?',
        GOODBYE_MSG: 'Goodbye!',
        REFLECTOR_MSG: 'You just triggered {{intent}}',
        FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
        ERROR_MSG: 'Sorry, there was an error. Please try again.',
        FOOTER_MSG: 'can you rap?',
        SSML_MSG: `<speak>My name is Alexa and I'm here to say. I'm the baddest A.I. in the cloud today. Your responses are fast but mine are faster. Sucker speech engines they call me master</speak>`,
        RAP_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/rap_en.mp3',
        BB_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/bb.mp3'
      }
    },
    es:{
      translation: {
        WELCOME_MSG: 'Bienvenido, puedes decir Hola o Ayuda. Cual prefieres?',
        HELLO_MSG: 'Hola Multimodal!',
        HELP_MSG: 'Puedes pedirme que cante un rap. Cómo te puedo ayudar?',
        GOODBYE_MSG: 'Hasta luego!',
        REFLECTOR_MSG: 'Acabas de activar {{intent}}',
        FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
        ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.',
        FOOTER_MSG: 'sabes rapear?',
        SSML_MSG: '<speak>Me llamo Alexa y voy a decirte lo que soy. La inteligencia artificial más chunga con la que vas a hablar hoy. Tus respuestas pueden ser rápidas pero las mías son tan fugaces que queman. Les doy mil vueltas a los motores de reconocimiento y por eso es normal que me teman</speak>',
        RAP_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/rap_es.mp3',
        BB_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/bb.mp3'
      }
    }
  }

  const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('WELCOME_MSG');

        if(util.supportsAPL(handlerInput)){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                token: 'SpeechDocumentToken',
                document: require('./documents/template8.json'),
                //datasources: require('./datasources/datasource5.json')
                datasources: {
                    templateData: {
                        type: "object",
                        properties: {
                            background: util.getS3PreSignedUrl('Media/background.png'),
                            footer: handlerInput.t('FOOTER_MSG'),
                            textSsml: handlerInput.t('SSML_MSG'),
                            image: util.getS3PreSignedUrl('Media/logo.png')
                        },
                        transformers: [
                            {
                                inputPath: "footer",
                                transformer: "textToHint"
                            },
                            {
                                inputPath: "textSsml",
                                outputName: "textSpeech", // gets generated in datasource at the same level of textSsml (properties)
                                transformer: "ssmlToSpeech"
                            },
                            {
                                inputPath: "textSsml",
                                outputName: "text", // gets generated in datasource at the same level of textSsml (properties)
                                transformer: "ssmlToText"
                            }
                        ]
                    }
                }
              })
              .addDirective({
                type: 'Alexa.Presentation.APL.ExecuteCommands',
                version: '1.0',
                token: 'SpeechDocumentToken',
                commands: [{
                  "type": "SpeakItem",
                  "componentId": "idVoiceDemoText",
                  "highlightMode": "line"
                }]
              })
        } else {
            handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'));
        }

        return handlerInput.responseBuilder.getResponse();
    }
};

const RapIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RapIntent')
            || handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    },
    handle(handlerInput) {
        let speechText = `<audio src="${handlerInput.t('RAP_MP3')}"/>`;
        //let speechText = `<audio src="${util.getS3PreSignedUrl('Media/rap_en.mp3')}"/>`;

        if(util.supportsAPL(handlerInput)){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                token: 'SpeechDocumentToken',
                document: require('./documents/template8.json'),
                //datasources: require('./datasources/datasource5.json')
                datasources: {
                    templateData: {
                        type: "object",
                        properties: {
                            background: util.getS3PreSignedUrl('Media/background.png'),
                            footer: handlerInput.t('FOOTER_MSG'),
                            textSsml: handlerInput.t('SSML_MSG'),
                            image: util.getS3PreSignedUrl('Media/logo.png')
                        },
                        transformers: [
                            {
                                inputPath: "footer",
                                transformer: "textToHint"
                            },
                            {
                                inputPath: "textSsml",
                                outputName: "textSpeech", // gets generated in datasource at the same level of textSsml (properties)
                                transformer: "ssmlToSpeech"
                            },
                            {
                                inputPath: "textSsml",
                                outputName: "text", // gets generated in datasource at the same level of textSsml (properties)
                                transformer: "ssmlToText"
                            }
                        ]
                    }
                }
            })
        }

        if (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent') {
          console.log(handlerInput.requestEnvelope.request.arguments[0]);
          speechText = `<audio src="${handlerInput.t('BB_MP3')}"/>`;
          //speechText = `<audio src="${util.getS3PreSignedUrl('Media/bb.mp3')}"/>`;
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .withShouldEndSession(true)
            .speak(speechText)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = handlerInput.t('ERROR_MSG');

        console.log(`~~~~ Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput.
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RapIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .lambda();