import { spawn } from 'child_process'

export default (
    params,
    file = 'scripts/data_retriever_pipeline.py',
    bin = 'python3.11'
) => {
    let buffer = Buffer.alloc(0)

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        console.log([bin, file, ...params].join(' '))
        const exec = spawn(bin, [file, ...params], {
            cwd: `${process.cwd()}`,
        })

        exec.stdout.on('data', (data) => {
            // eslint-disable-next-line
            console.log('stdout', data.toString())
            buffer = Buffer.concat([buffer, data])
        })

        exec.stderr.on('data', (data) => {
            // eslint-disable-next-line
            console.log('stderr', data.toString())
            reject(data.toString())
        })

        exec.stdout.on('end', (a, b, c) => {
            // eslint-disable-next-line
            console.log('stdout end', buffer.toString())
            resolve(buffer.toString())
        })
    })
}
