export class FollowController {
    constructor(service) {
        this.service = service;

        this.getRequests = this.getRequests.bind(this);
        this.getFollowings = this.getFollowings.bind(this);
        this.getFollowers = this.getFollowers.bind(this);
        this.follow = this.follow.bind(this);
    }

    async getRequests(req, res) {
        const requests = await this.service.getAllRequests(req.user.id);
        return res.status(200).send({ requests });
    }

    async getFollowings(req, res) {
        const { followingsInfo } = req.body;
        const followings = await this.service.getAllFollowings(followingsInfo);
        return res.status(200).send({ followings });
    }

    async getFollowers(req, res) {
        const { followersInfo } = req.body;
        const followers = await this.service.getAllFollowers(followersInfo);
        return res.status(200).send({ followers });
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
