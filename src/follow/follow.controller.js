export class FollowController {
    constructor(service) {
        this.service = service;

        this.getRequests = this.getRequests.bind(this);
        this.follow = this.follow.bind(this);
    }

    async getRequests(req, res) {
        const requests = await this.service.getAllRequests(req.user.id);
        return res.status(200).send({ requests });
    }

    async acceptRequest(req, res) {
        return res.status(200).send({ message: "Follow request accepted" });
    }

    async declineRequest(req, res) {
        return res.status(200).send({ message: "Follow request declined" });
    }

    async follow(req, res) {
        const { id: to } = req.params;
        const { id: from } = req.user;
        const result = await this.service.createRequest(from, to, true, false);
        return res.status(200).send({ status: "Followed", result });
    }
}
