import { spawn } from 'child_process'
export default (command) => {
    let buffer = Buffer.alloc(0)
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        console.log(`command: ${command}`)
        const execute = spawn(
            command.split(' ')[0],
            command.split(' ').slice(1),
            {
                cwd: `${process.cwd()}`,
            }
        )
        execute.stdout.on('data', (data) => {
            // eslint-disable-next-line
            console.log('stdout', data.toString())
            const dataBuffer = Buffer.from(data) // Convert data to buffer
            buffer = Buffer.concat([buffer, dataBuffer])
        })
        execute.stderr.on('data', (data) => {
            // eslint-disable-next-line
            console.log('stderr', data.toString())
            reject(data.toString())
        })
        execute.stdout.on('end', () => {
            // eslint-disable-next-line
            // console.log('stdout end', buffer.toString())
            resolve(buffer.toString())
        })
    })
}
