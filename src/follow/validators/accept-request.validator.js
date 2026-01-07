export default async function acceptRequestValidator(service, req, res, next) {
    const { from, to } = req.body;
    const found = await service.getRequest(from, to);

    if (!found) {
        return res.status(404).send({ message: "Not found" });
    }

    found.approved = true;
    await found.save();

    return next();
}
