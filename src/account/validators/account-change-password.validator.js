export default async function accountChangePasswordValidator(
    service,
    sendEmail,
    req,
    res,
    next
) {
    const { currentPasswordForPassword, newPassword } = req.body;
    const { email } = req.user;

    if (!currentPasswordForPassword?.trim() || !newPassword?.trim()) {
        return res
            .status(400)
            .send({ message: "Missing/Invalid credentials..." });
    }

    const user = await service.findUser({ email });
    const isPasswordCorrect = await service.checkPassword(
        currentPasswordForPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(400).send({
            message:
                "Your current password is incorrect, try another or reset if you forgot",
        });
    }

    if (currentPasswordForPassword == newPassword) {
        return res.status(400).send({
            message: "You have used this password previously, try another",
        });
    }

    user.password = await service.hashPassword(newPassword);
    await user.save();

    return next();
}
