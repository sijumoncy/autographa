import ConcatAudio from './concatAudio';
import * as logger from '../../../logger';

const audio = new ConcatAudio();

// async function writeRecfile(file, audioExportPath, audioName, path) {
//     const fs = window.require('fs');
//     const fileReader = new FileReader();
//     console.log({ audioName }, path.join(audioExportPath, audioName));
//     fileReader.onload = function () {
//         fs.mkdirSync(audioExportPath, { recursive: true });
//         fs.writeFileSync(path.join(audioExportPath, audioName), Buffer.from(new Uint8Array(this.result)));
//     };
//     fileReader.readAsArrayBuffer(file);
// }
function writeRecfile(file) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        logger.debug('ExportProjectPopUp.js', 'generating array buffer for merged audio');
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsArrayBuffer(file);
    });
}

function sec_to_min_sec_milli_convertor(time) {
    let milliseconds = time.toString().split('.')[1];
    if (milliseconds === undefined) {
        milliseconds = 0;
    }
    const minutes = Math.floor(time / 60);
    const seconds = (time - minutes * 60).toString().split('.')[0].padStart(2, 0);
    const formatedStringTime = `${minutes.toString().padStart(2, 0)}:${seconds}:${milliseconds}`;
    return [minutes, seconds, milliseconds, formatedStringTime];
}

async function generateTimeStampData(buffers, book, chapter) {
    logger.debug('audioUtils.js', 'In TimeStamp Generation');
    return new Promise((resolve) => {
        let fileString = 'Name,Start,Duration,Time Format\n';
        const seperator = ',';
        const fileType = 'csv';
        const file = `${book}_${chapter.toString().padStart(3, 0)}.${fileType}`;
        let start = 0;
        buffers.forEach((buffer, index) => {
            const currentVerse = `Verse ${(index + 1).toString().padStart(0, 2)}`;
            const startTimeString = sec_to_min_sec_milli_convertor(start)[3];
            const durationString = sec_to_min_sec_milli_convertor(buffer.duration)[3];
            fileString += `${currentVerse + seperator + startTimeString + seperator + durationString + seperator }decimal\n`;
            start += buffer.duration;
        });
        resolve([file, fileString]);
    });
}

export async function mergeAudio(audioArr, dirPath, path, book, chapter) {
    return new Promise((resolve) => {
        let merged;
        let output;
        audioArr.sort();
        for (let i = 0; i < audioArr.length; i++) {
            audioArr[i] = path.join(dirPath, audioArr[i]);
        }
        logger.debug('ExportProjectPopUp.js', 'start merging audios');
        audio.fetchAudio(...audioArr)
        .then(async (buffers) => {
            // generate timestamp data string
            await generateTimeStampData(buffers, book, chapter)
            .then((timeStampData) => {
                // merging all buffers
                merged = audio.concatAudio(buffers);
                return [merged, timeStampData];
            })
            .then(async ([merged, timeStampData]) => {
                output = audio.export(merged, 'audio/mp3');
                logger.debug('ExportProjectPopUp.js', 'Exported Merged Audio');
                await writeRecfile(output.blob)
                .then((resolveData) => {
                    logger.debug('ExportProjectPopUp.js', 'Resolved array buffer of Merged Audio');
                    resolve([resolveData, timeStampData]);
                });
            });
        });
    });
}