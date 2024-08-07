import bunyan from 'bunyan'
import {serializeError} from 'serialize-error'
import {fileURLToPath} from 'url'
import path from 'path'
import fs from 'node:fs/promises'
import config from './config/config.js'

let logger

async function addPowerboardLog(data) {
    const logKey = `powerboard-log_${Date.now()}`;
    const logObject = {
        container: "powerboard-logs",
        key: logKey,
        value: data
    };

    const ctpClient = await config.getCtpClient()
    await ctpClient.create(
        ctpClient.builder.customObjects,
        JSON.stringify(logObject)
    )
}

function collectRequestData(request) {
    return new Promise((resolve) => {
        const data = []

        request.on('data', (chunk) => {
            data.push(chunk)
        })

        request.on('end', () => {
            const dataStr = Buffer.concat(data).toString()
            resolve(dataStr)
        })
    })
}

function sendResponse({response, statusCode = 200, headers, data}) {
    response.writeHead(statusCode, headers)
    response.end(JSON.stringify(data))
}

function getLogger() {
    if (!logger)
        logger = bunyan.createLogger({
            name: 'ctp-powerboard-integration-extension',
            stream: process.stderr,
            level: config.getModuleConfig()?.logLevel || bunyan.INFO,
        })
    return logger
}

function handleUnexpectedPaymentError(paymentObj, err) {
    const errorMessage =
        '[powerboard-pay-integration-extension] ' +
        `Unexpected error (Payment ID: ${paymentObj?.id}): ${err.message}.`
    const errorStackTrace = `Unexpected error (Payment ID: ${
        paymentObj?.id
    }): ${JSON.stringify(serializeError(err))}`
    getLogger().error(errorStackTrace)
    return {
        errors: [
            {
                code: 'General',
                message: errorMessage,
            },
        ],
    }
}

async function readAndParseJsonFile(pathToJsonFileFromProjectRoot) {
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDirPath = path.dirname(currentFilePath)
    const projectRoot = path.resolve(currentDirPath, '..')
    const pathToFile = path.resolve(projectRoot, pathToJsonFileFromProjectRoot)
    const fileContent = await fs.readFile(pathToFile)
    return JSON.parse(fileContent)
}

async function deleteElementByKeyIfExists(ctpClient, key) {
    try {
        const { body } = await ctpClient.fetchByKey(
            ctpClient.builder.extensions,
            key,
        )
        if(body){
            await ctpClient.delete(ctpClient.builder.extensions, body.id, body.version)
        }
        return body
    } catch (err) {
        if (err.statusCode === 404) return null
        throw err
    }
}

export default {
    collectRequestData,
    sendResponse,
    getLogger,
    handleUnexpectedPaymentError,
    readAndParseJsonFile,
    addPowerboardLog,
    deleteElementByKeyIfExists
}
