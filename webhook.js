const https = require('https');

const webhookUrl = 'https://discord.com/api/webhooks/1379038305831620638/NBIvFrPcOJ2wcCCnNjNg2H8HbCl-WKC21z6Hav44kuTGvatklsci2hwT2NUejT6XSwoG';

function formatRemainingTime(distance) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
}

async function sendWebhook() {
    const targetDate = new Date('December 2, 2025 09:27:00').getTime();
    const startDate = new Date('June 2, 2025 09:27:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    const totalDuration = targetDate - startDate;
    const elapsed = now - startDate;
    
    if (distance <= 0) {
        console.log('Countdown finished, not sending webhook');
        return;
    }

    const timeObj = formatRemainingTime(distance);
    const progressBarLength = 20;
    const progressPercent = Math.min((elapsed / totalDuration), 1);
    const filledLength = Math.round(progressBarLength * progressPercent);
    const emptyLength = progressBarLength - filledLength;
    const progressBar = '🟥'.repeat(filledLength) + '⬜'.repeat(emptyLength);

    // Format elapsed time
    const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const elapsedHours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const elapsedSeconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    // Dynamic status message based on progress
    let statusMessage = "Keep going!";
    if (progressPercent >= 1) {
        statusMessage = "🎉 Countdown finished! 🎉";
    } else if (progressPercent > 0.75) {
        statusMessage = "Almost there!";
    } else if (progressPercent > 0.5) {
        statusMessage = "More than halfway done!";
    } else if (progressPercent > 0.25) {
        statusMessage = "Making progress!";
    }

    const postData = JSON.stringify({
        embeds: [
            {
                title: "🚀 Henclin Unban Countdown 🚀",
                description: statusMessage,
                color: 0xe53935,
                author: {
                    name: "Henclin Countdown Bot",
                    icon_url: "https://cdn-icons-png.flaticon.com/512/2920/2920250.png"
                },
                fields: [
                    {
                        name: "Time Remaining",
                        value: `${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s`,
                        inline: true
                    },
                    {
                        name: "Elapsed Time",
                        value: `${elapsedDays}d ${elapsedHours}h ${elapsedMinutes}m ${elapsedSeconds}s`,
                        inline: true
                    },
                    {
                        name: "Progress",
                        value: progressBar,
                        inline: false
                    },
                    {
                        name: "Percentage Complete",
                        value: `${(progressPercent * 100).toFixed(2)}%`,
                        inline: true
                    }
                ],
                footer: {
                    text: "Henclin Unban Countdown",
                    icon_url: "https://cdn-icons-png.flaticon.com/512/2920/2920250.png"
                },
                timestamp: new Date().toISOString()
            }
        ]
    });

    const options = {
        hostname: 'discord.com',
        path: '/api/webhooks/1379038305831620638/NBIvFrPcOJ2wcCCnNjNg2H8HbCl-WKC21z6Hav44kuTGvatklsci2hwT2NUejT6XSwoG',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(postData);
    req.end();
}

sendWebhook().catch(console.error);
