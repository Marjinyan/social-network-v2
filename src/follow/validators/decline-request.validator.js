export default async function declineRequestValidator(service, req, res, next) {
    const { from, to } = req.body;
    const request = await service.getRequest(from, to);

    if (!request) {
        return res.status(404).send({ message: "Not found" });
    }

    await request.destroy();

    return next();
}
