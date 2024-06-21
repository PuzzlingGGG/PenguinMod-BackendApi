module.exports = (app, utils) => {
    app.post("/api/v1/users/resetpassword/sendEmail", utils.rateLimiter({
        validate: {
            trustProxy: true,
            xForwardedForHeader: true,
        },
        windowMs: 1000 * 60 * 60,  // x requests per hour
        limit: 60,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
    }), async (req, res) => {
        const packet = req.body;

        const email = packet.email;

        if (!await utils.UserManager.emailInUse(email)) {
            utils.error(res, 400, "EmailNotFound");
            return;
        }

        const state = await utils.UserManager.generateOAuth2State();

        const username = await utils.UserManager.getUsernameByEmail(email); // just so we can send the email like "Hello, username"

        if (!await utils.UserManager.isEmailVerified(username)) {
            utils.error(res, 400, "EmailNotVerified");
            return;
        }

        const forgotPasswordUrl = "https://example.com/";

        const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
        <html><body>
        <p style='background-color: #129aeb; color: white; font-size: 48px; font-weight: bold; font-family: "Helvetica Neue", Arial, sans-serif; padding: 60px 10%;' align="center">PenguinMod Password Reset</p>
            <h1 style='font-family: "Helvetica Neue", Arial, sans-serif;'>Hello ${username}!</h1>
            <p style='font-family: "Helvetica Neue", Arial, sans-serif;'>You are getting this email as someone has asked to reset the password for this PenguinMod account.</p>
        <p style='font-family: "Helvetica Neue", Arial, sans-serif;'><a href="${forgotPasswordUrl}">Reset Password</a></p>
        <br>
        <p style='font-family: "Helvetica Neue", Arial, sans-serif;'>If you did not ask to reset your password, you can delete this email or ignore it.</p>
            <p style='font-family: "Helvetica Neue", Arial, sans-serif;'>Do not forward, share, or reply to this email. Replies will not be seen or answered.</p>

        <img src="https://penguinmod.com/favicon.png" alt="PenguinMod" width="64" height="64" style="width: 64px; height: 64px;">
        </body></html>`;
        const emailPlainText = `PenguinMod Password Reset

        ********************
        Hello ${username}!
        ********************

        You are getting this email as someone has asked to reset the
        password for this PenguinMod account.

        Reset Password:
        ${forgotPasswordUrl}

        If you did not ask to reset your password, you can delete this
        email or ignore it.

        Do not forward, share, or reply to this email. Replies will
        not be seen or answered.

        PenguinMod`;

        /*/ 
         * BTODO:
         * Send email here
         * Link should be something like: https://penguinmod.com/resetpassword?state=STATE&email=EMAIL
         * Make sure to include that the link will expire 5 minutes after it's sent, this can be changed later
        /*/

        const userid = await utils.UserManager.getIDByUsername(username);

        await utils.UserManager.sendEmail(userid, req.realIP, "reset", email, username, "Reset Your Password", emailPlainText, emailHtml);

        res.send(200);
        res.header("Content-Type", 'application/json');
        res.send({ url: `https://penguinmod.com/resetpassword?state=${state}&email=${email}` }); // BTODO: once the email sending stuff is done, change this to just res.send({ "success": true });
    });
}