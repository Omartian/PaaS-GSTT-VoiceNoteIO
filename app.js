const express = require('express')
const bodyParser = require('body-parser');
const speech = require('@google-cloud/speech')
const fs = require('fs');
const app = express()
const port = 8080
const client = new speech.SpeechClient();
app.use(bodyParser.json());
var cors = require('cors')

app.use(cors())

const TOKEN_ARG = 2;
const tokenPath = process.argv[TOKEN_ARG];
process.env.GOOGLE_APPLICATION_CREDENTIALS = tokenPath;

async function main() {
    
    const gcsUri = 'gs://voice-note-io-audios/abc.flac';

    const audio = {
        uri: gcsUri,
    };
    const config = {
        encoding: 'FLAC',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
        audioChannelCount: 2,
    };
    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    console.log(`${transcription}`);
}

main().catch(console.error);

app.post('/transcript',async (req, res) => {
    const gcsUri = 'gs://voice-note-io-audios/' + req.body.idUser + "-" + req.body.idAudio +'.flac';

    const audio = {
        uri: gcsUri,
    };
    const config = {
        encoding: 'FLAC',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
        audioChannelCount: 2,
    };
    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    res.send( {"text": response});
})


app.get('/', (req, res) => {
  res.send('PaaS de Transcripción de audio usando Cloud Speech-to-Text API de Google')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
