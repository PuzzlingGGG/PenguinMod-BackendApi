const fs = require("fs");
const path = require("path");

module.exports = (app, utils) => {
    app.post("/api/v1/misc/updateApi", async (req, res) => {
        let packet = req.body;

        // get headers
        const headers = req.headers;

        packet.headers = headers;

        // write packet and headers to file
        fs.writeFileSync(path.join(utils.homeDir, "apiPacket.json"), JSON.stringify(packet, null, 4));

        res.status(200);
        res.header("Content-Type", "application/json");
        res.send({ success: true });
    });
}