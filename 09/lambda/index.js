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
        WELCOME_MSG: 'Welcome, you can ask me for a karaoke, ask me if i can rap or ask for my favorite songs. Which would you like to try?',
        HELP_MSG: 'You can ask me for a karaoke, ask me if i can rap or ask for my favorite songs. Which would you like to try?',
        WHAT_NEXT_MSG: 'What would you like to do next?',
        GOODBYE_MSG: 'Goodbye!',
        REFLECTOR_MSG: 'You just triggered {{intent}}',
        FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
        ERROR_MSG: 'Sorry, there was an error. Please try again.',
        FOOTER_MSG: ['can you rap?', 'what are your favorite songs?'],
        SSML_MSG: `<speak>My name is Alexa and I'm here to say. I'm the baddest A.I. in the cloud today. Your responses are fast but mine are faster. Sucker speech engines they call me master.</speak>`,
        RAP_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/rap_en.mp3',
        BB_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/bb.mp3',
        LIST_HEADER_MSG: 'Favorite Songs',
        LIST_SPEECH_MSG: 'Here are a few of my favorite songs. ',
        LIST_TRY_MSG: 'Try saying, ',
        LIST_HINT_MSG: 'select or play the first one',
        LIST_MISSING_MSG: 'In order to select items you need to first ask me for my favorite songs. '
      }
    },
    es:{
      translation: {
        WELCOME_MSG: 'Bienvenido, puedes pedirme un karaoke, preguntarme si sé rapear o pedirme mis canciones favoritas. Qué quieres hacer?',
        HELP_MSG: 'Puedes pedirme un karaoke, preguntarme si sé rapear o pedirme mis canciones favoritas. Qué quieres hacer?',
        WHAT_NEXT_MSG: 'Qué otra cosa te gustaría hacer?',
        GOODBYE_MSG: 'Hasta luego!',
        REFLECTOR_MSG: 'Acabas de activar {{intent}}',
        FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
        ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.',
        FOOTER_MSG: ['sabes rapear?', 'cuáles son tus canciones favoritas?'],
        SSML_MSG: '<speak>Me llamo Alexa y voy a decirte lo que soy. La inteligencia artificial más chunga con la que vas a hablar hoy. Tus respuestas pueden ser rápidas pero las mías son tan fugaces que queman. Les doy mil vueltas a los motores de reconocimiento y por eso es normal que me teman.</speak>',
        RAP_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/rap_es.mp3',
        BB_MP3: 'https://s3-eu-west-1.amazonaws.com/miscalexa/bb.mp3',
        LIST_HEADER_MSG: 'Canciones Favoritas',
        LIST_SPEECH_MSG: 'Aquí tienes algunas de mis canciones favoritas. ',
        LIST_TRY_MSG: 'Prueba decir, ',
        LIST_HINT_MSG: 'reproduce o selecciona la primera',
        LIST_MISSING_MSG: 'Para poder seleccionar elementos tienes que preguntarme primero por mis canciones favoritas. '
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
                            textSsml: "<speak>Hey!</speak>",
                            image: util.getS3PreSignedUrl('Media/logo.png')
                        },
                        transformers: [
                            {
                                inputPath: "footer",
                                transformer: "textToHint"
                            },
                            {
                                inputPath: "textSsml",
                                outputName: "text", // gets generated in datasource at the same level of textSsml (properties)
                                transformer: "ssmlToText"
                            }
                        ]
                    }
                }
            });
        }
  
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const KaraokeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'KaraokeIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('SSML_MSG');

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
              });
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
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RapIntent';
    },
    handle(handlerInput) {
        let mp3Url = handlerInput.t('RAP_MP3');

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
                            textSpeech: mp3Url, // this hack allows SpeakItem to play an mp3
                            image: util.getS3PreSignedUrl('Media/logo.png')
                        },
                        transformers: [
                            {
                                inputPath: "footer",
                                transformer: "textToHint"
                            },
                            {
                                inputPath: "textSsml",
                                outputName: "text", // gets generated in datasource at the same level of textSsml (properties)
                                transformer: "ssmlToText"
                            }
                        ]
                    }
                }
            }).addDirective({
                type: 'Alexa.Presentation.APL.ExecuteCommands',
                version: '1.0',
                token: 'SpeechDocumentToken',
                commands: [
                    {
                        "type": "SpeakItem",
                        "componentId": "idVoiceDemoText"
                    }
                ]
            });
        } else {
            handlerInput.responseBuilder.speak(`<audio src="${handlerInput.t('RAP_MP3')}"/>`);
        }

        return handlerInput.responseBuilder.getResponse();
    }
};

const SongsIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SongsIntent';
    },
    handle(handlerInput){
        let speechText = handlerInput.t('LIST_SPEECH_MSG');
        const songList = require('./documents/listsample.json');
        if (util.supportsAPL(handlerInput)) {
            speechText += handlerInput.t('LIST_TRY_MSG') + handlerInput.t('LIST_HINT_MSG');
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                token: 'ListDocumentToken',
                document: require('./documents/listscreen1.json'),
                datasources: {
                    listData: {
                        type: 'object',
                        properties: {
                            config: {
                                backgroundImage: util.getS3PreSignedUrl('Media/background.png'),
                                title: handlerInput.t('LIST_HEADER_MSG'),
                                skillIcon: util.getS3PreSignedUrl('Media/logo.png'),
                                hintText: handlerInput.t('LIST_HINT_MSG')
                            },
                            list: songList
                        },
                        transformers: [{
                            inputPath: 'config.hintText',
                            transformer: 'textToHint'
                        }]
                    }
                }
            });
        } else {
            for(var i = 0; i < songList.tracks.length; i++){
                speechText += `<lang xml:lang="en-US">${songList.tracks[i].name}</lang>`;
                i !== songList.tracks.length ? speechText += ', ' : speechText += '. '
            }
            speechText += handlerInput.t('WHAT_NEXT_MSG');
        }
            
        handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'));

        return handlerInput.responseBuilder.getResponse();
    }
}

const TouchIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    },
    handle(handlerInput) {
        let song = handlerInput.requestEnvelope.request.arguments[0];
        if (typeof song === 'string' || song instanceof String){
            song = JSON.parse(song);
        }
        console.log('Touch event arguments: ' + JSON.stringify(song));
        console.log(song.previewURL);

        let speechText = `<audio src="` + song.previewURL + `"/> ` + handlerInput.t('WHAT_NEXT_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const SelectionIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.SelectIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'SelectIntent');
    },
    handle(handlerInput){
        const postionSlot = handlerInput.getSlot('ListPosition');
        let position = handlerInput.getSlotValue('ListPosition');
        if(isNaN(position)){
            // custom select intent in es-ES does not return a number
            position = postionSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        console.log('Position: ' + position);
        const songList = require('./documents/listsample.json');
        let speechText = `<audio src="` + songList.tracks[position-1].previewURL + `"/> ` + handlerInput.t('WHAT_NEXT_MSG');
        const aplRequestData = handlerInput.requestEnvelope.context['Alexa.Presentation.APL'];
        if(aplRequestData && JSON.stringify(aplRequestData).includes('ListDocumentToken')){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.ExecuteCommands',
                version: '1.0',
                token: 'ListDocumentToken',
                commands: [
                    {
                        "type": "ScrollToIndex",
                        "componentId": "mySequence",
                        "index": position-1,
                        "align": "center"
                    }
                ]
            });
        } else {
            speechText = handlerInput.t('LIST_MISSING_MSG');
        }
            
        handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'));

        return handlerInput.responseBuilder.getResponse();
    }
}

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
        const localisationClient = i18n.init({
            lng: handlerInput.getLocale(),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

const SDKUtilitiesRequestInterceptor = {
    process(handlerInput) {
        handlerInput.getLocale = function getLocale() {
            return Alexa.getLocale(handlerInput.requestEnvelope);
        }
        handlerInput.getRequestType = function getRequestType() {
            return Alexa.getRequestType(handlerInput.requestEnvelope);
        }
        handlerInput.getIntentName = function getIntentName() {
            return Alexa.getIntentName(handlerInput.requestEnvelope);
        }
        handlerInput.getAccountLinkingAccessToken = function getAccountLinkingAccessToken() {
            return Alexa.getAccountLinkingAccessToken(handlerInput.requestEnvelope);
        }
        handlerInput.getApiAccessToken = function getApiAccessToken() {
            return Alexa.getApiAccessToken(handlerInput.requestEnvelope);
        }
        handlerInput.getDeviceId = function getDeviceId() {
            return Alexa.getDeviceId(handlerInput.requestEnvelope);
        }
        handlerInput.getUserId = function getUserId() {
            return Alexa.getUserId(handlerInput.requestEnvelope);
        }
        handlerInput.getDialogState = function getDialogState() {
            return Alexa.getDialogState(handlerInput.requestEnvelope);
        }
        handlerInput.getSupportedInterfaces = function getSupportedInterfaces() {
            return Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
        }
        handlerInput.isNewSession = function isNewSession() {
            return Alexa.isNewSession(handlerInput.requestEnvelope);
        }
        handlerInput.getSlot = function getSlot(slotName) {
            return Alexa.getSlot(handlerInput.requestEnvelope, slotName);
        }
        handlerInput.getSlotValue = function getSlotValue(slotName) {
            return Alexa.getSlotValue(handlerInput.requestEnvelope, slotName);
        }
        handlerInput.escapeXmlCharacters = function escapeXmlCharacters(input) {
            return Alexa.escapeXmlCharacters(input);
        }
        handlerInput.getViewportOrientation = function getViewportOrientation(width, height) {
            return Alexa.getViewportOrientation(handlerInput.requestEnvelope, width, height);
        }
        handlerInput.getViewportSizeGroup = function getViewportSizeGroup(size) {
            return Alexa.getViewportSizeGroup(size);
        }
        handlerInput.getViewportDpiGroup = function getViewportDpiGroup(dpi) {
            return Alexa.getViewportDpiGroup(dpi);
        }
        handlerInput.getViewportProfile = function getViewportProfile() {
            return Alexa.getViewportProfile(handlerInput.requestEnvelope);
        }
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        KaraokeIntentHandler,
        RapIntentHandler,
        SongsIntentHandler,
        TouchIntentHandler,
        SelectionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        SDKUtilitiesRequestInterceptor,
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .lambda();