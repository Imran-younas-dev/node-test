module.exports = {
    apps: [
        {
            name: 'api',
            exec_mode: 'fork',
            instances: 1,
            script: 'npm',
            args: 'start',
            increment_var: 'PORT',
            time: true,
            env: {
                PORT: 3001,
            },
        },
        {
            name: 'cron',
            exec_mode: 'fork',
            instances: 1,
            script: 'npm',
            args: 'run cron',
            time: true,
        },
        {
            name: 'queue',
            exec_mode: 'fork',
            instances: 1,
            script: 'npm',
            args: 'run queue',
            time: true,
        },
    ],
}
