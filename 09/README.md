# APLWorkshop - 09
List visualization and voice selection. The sample now shows how to process a list of songs and artists (e.g. could come straight from an API) supporting touch and voice selection.

## Concepts
- Sequence, ScrollToIndex, SelectIntent

## Documents
- template8 + datasource5: no changes
- listscreen1.json: song list APL document with different layouts for round and rectangular screens
- listsample.json: songs metadata
- listsource1.json: datasource to test in the display prototyping tool
- index.js: added SongsIntentHandler and SelectionIntentHandler. Modified TouchIntentHandler to play songs samples

## Model
- es-ES.json: added SongsIntent. Added custom SelectIntent (AMAZON.SelectIntent not yet available)
- en-US.json: added SongsIntent. Added AMAZON.SelectIntent

## TODO
- Switch to APL 1.1 and use feature to execute the ScrollToIndex command before the speak() directive
- Add dynamic entities support to allow selection by song name