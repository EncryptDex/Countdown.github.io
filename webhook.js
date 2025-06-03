import fetch from 'node-fetch';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1379038305831620638/NBIvFrPcOJ2wcCCnNjNg2H8HbCl-WKC21z6Hav44kuTGvatklsci2hwT2NUejT6XSwoG';

async function calculateTime() {
    const targetDate = new Date('December 2, 2025 09:27:00').getTime();
    const startDate = new Date('June 2, 2025 09:27:00').getTime();
    const now = new Date().getTime();
    
    const distance = targetDate - now;
    const totalDuration = targetDate - startDate;
    const elapsed = now - startDate;
    
    if (distance <= 0) {
        return { finished: true };
    }

    // Format remaining time
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format elapsed time
    const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const elapsedHours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const elapsedSeconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    // Calculate progress
    const progressPercent = Math.min((elapsed / totalDuration), 1);
    const progressBarLength = 20;
    const filledLength = Math.round(progressBarLength * progressPercent);
    const progressBar = '🟥'.repeat(filledLength) + '⬜'.repeat(progressBarLength - filledLength);

    return {
        finished: false,
        remaining: { days, hours, minutes, seconds },
        elapsed: { days: elapsedDays, hours: elapsedHours, minutes: elapsedMinutes, seconds: elapsedSeconds },
        progress: {
            percent: progressPercent,
            bar: progressBar
        }
    };
}

function getStatusMessage(progressPercent) {
    if (progressPercent >= 1) return "🎉 Countdown finished! 🎉";
    if (progressPercent > 0.75) return "Almost there!";
    if (progressPercent > 0.5) return "More than halfway done!";
    if (progressPercent > 0.25) return "Making progress!";
    return "Keep going!";
}

async function sendWebhook() {
    try {
        const timeData = await calculateTime();
        
        if (timeData.finished) {
            console.log('Countdown finished, not sending webhook');
            return;
        }

        const statusMessage = getStatusMessage(timeData.progress.percent);

        const embed = {
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
                    value: `${timeData.remaining.days}d ${timeData.remaining.hours}h ${timeData.remaining.minutes}m ${timeData.remaining.seconds}s`,
                    inline: true
                },
                {
                    name: "Elapsed Time",
                    value: `${timeData.elapsed.days}d ${timeData.elapsed.hours}h ${timeData.elapsed.minutes}m ${timeData.elapsed.seconds}s`,
                    inline: true
                },
                {
                    name: "Progress",
                    value: timeData.progress.bar,
                    inline: false
                },
                {
                    name: "Percentage Complete",
                    value: `${(timeData.progress.percent * 100).toFixed(2)}%`,
                    inline: true
                }
            ],
            footer: {
                text: "Henclin Unban Countdown",
                icon_url: "https://cdn-icons-png.flaticon.com/512/2920/2920250.png"
            },
            timestamp: new Date().toISOString()
        };

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (!response.ok) {
            throw new Error(`Webhook failed with status ${response.status}`);
        }

        console.log('Webhook sent successfully');
    } catch (error) {
        console.error('Error sending webhook:', error.message);
    }
}

await sendWebhook();
