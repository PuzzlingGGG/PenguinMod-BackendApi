module.exports = (app, utils) => {
    app.get('/api/v1/users/ismod', async function (req, res) {
        const packet = req.query;

        const username = packet.username;
        const token = packet.token;

        const target = packet.target;

        if (!username || !token || typeof target !== "string") {
            return utils.error(res, 400, "Missing username or token");
        }

        if (!await utils.UserManager.loginWithToken(username, token)) {
            return utils.error(res, 401, "Invalid credentials");
        }

        if (!await utils.UserManager.isAdmin(username)) {
            return utils.error(res, 401, "Unauthorized");
        }

        const mods = await utils.UserManager.getAllModerators();

        res.status(200);
        res.header('Content-type', "application/json");
        res.send({ mods: mods });
    });
}