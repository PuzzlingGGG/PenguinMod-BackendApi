require('dotenv').config();

const heatWebhook = process.env.HeatWebhook;
const bioUpdateWebhook = process.env.BioWebhook;
const reportWebhook = process.env.ReportWebhook;
const adminWebhook = process.env.AdminWebhook;

function sendHeatLog(text, type, location, color="\x1b[0m") {
    const body = JSON.stringify({
        embeds: [{
            title: `Filter Triggered`,
            color: 0xff0000,
            description: `\`\`\`${text}\n\`\`\``,
            fields: [
                {
                    name: "Type",
                    value: `\`${type}\``
                },
                {
                    name: "Location",
                    value: `${JSON.stringify(location)}`
                }
            ],
            timestamp: new Date().toISOString()
        }]
    });
    fetch(heatWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}

function sendBioUpdateLog(username, target, oldBio, newBio) {
    const body = JSON.stringify({
        content: `${target}'s bio was edited by ${username}`,
        embeds: [{
            title: `${target} had their bio edited`,
            color: 0xff0000,
            fields: [
                {
                    name: "Edited by",
                    value: `${username}`
                },
                {
                    name: "URL",
                    value: `https://penguinmod.com/profile?user=${target}`
                },
            ],
            author: {
                name: target,
                icon_url: String("http://localhost:8080/api/v1/users/getpfp?username=" + target),
                url: String("https://penguinmod.com/profile?user=" + target)
            },
            timestamp: new Date().toISOString()
        }, {
            title: `New Bio for ${target}`,
            color: 0xffbb00,
            description: `${newBio}`
        }, {
            title: `Original Bio for ${target}`,
            color: 0xffbb00,
            description: `${oldBio}`
        }]
    });
    fetch(bioUpdateWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}

function sendReportLog(username, target, reason) {
    const body = JSON.stringify({
        content: `${username} reported ${target}`,
        embeds: [{
            title: `${target} was reported`,
            color: 0xff0000,
            fields: [
                {
                    name: "Reported by",
                    value: `${username}`
                },
                {
                    name: "Reason",
                    value: `${reason}`
                },
                {
                    name: "URL",
                    value: `https://penguinmod.com/profile?user=${target}`
                }
            ],
            author: {
                name: target,
                icon_url: String("http://localhost:8080/api/v1/users/getpfp?username=" + target),
                url: String("https://penguinmod.com/profile?user=" + target)
            },
            timestamp: new Date().toISOString()
        }]
    });

    fetch(reportWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}

function sendMultiReportLog(username, target, reason) {
    const body = JSON.stringify({
        content: `${username} reported ${target}`,
        embeds: [{
            title: `Multiple Reports`,
            color: 0xff0000,
            fields: [
                {
                    name: "Reporter",
                    value: `${username}`
                },
                {
                    name: "Reason",
                    value: `${reason}`
                },
                {
                    name: "URL",
                    value: `https://penguinmod.com/profile?user=${username}`
                }
            ],
            author: {
                name: target,
                icon_url: String("http://localhost:8080/api/v1/users/getpfp?username=" + target),
                url: String("https://penguinmod.com/profile?user=" + target)
            },
            timestamp: new Date().toISOString()
        }]
    });

    fetch(reportWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}

function sendAdminLog(username, target, action) {
    const body = JSON.stringify({
        content: `${username} ${action} ${target}`,
        embeds: [{
            title: `${target} was ${action}`,
            color: 0xff0000,
            fields: [
                {
                    name: "Action",
                    value: `${action}`
                },
                {
                    name: "URL",
                    value: `https://penguinmod.com/profile?user=${target}`
                }
            ],
            author: {
                name: target,
                icon_url: String("http://localhost:8080/api/v1/users/getpfp?username=" + target),
                url: String("https://penguinmod.com/profile?user=" + target)
            }
        }]
    });

    fetch(adminWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}