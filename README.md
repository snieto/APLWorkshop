# APLWorkshop
Pregressive demo for intro APL workshop

- 01: First APL doc with just a background image. First container with image and text. supportsAPL() function
- 02: Parameterized document (from payload) with datasource
- 03: Import, resources and styles (both alexa-styles and custom style)
- 04: Layouts (both custom and alexa-layouts (AlexaFooter)). When clauses and viewport (alexa-viewport-profiles)
- 05: Transformers (textToHint) -> appends wake word to hint at footer
- 06: Transformers 2 (ssmlToSpeech) -> converts SSML to spoken words. Commands (execute command directive). Karaoke highlighting
- 07: Added Rap intent (no changes to APL fuctionality). Karaoke is now more obvious as the text is longer
- 08: Touch wrapper. Use SetState to disable TouchWrapper after 1st touch. Use SetValue to change property of rendered APL document
