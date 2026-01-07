export class FollowService {
    constructor(userModel, followModel, SAFE_USER) {
        this.userModel = userModel;
        this.followModel = followModel;

        this.SAFE_USER = SAFE_USER;
    }

    async getAllRequests(to, approved = 0) {
        return await this.followModel.findAll({
            where: {
                to,
                approved,
            },
            include: {
                model: this.userModel,
                as: "sender",
                attributes: this.SAFE_USER,
            },
            attributes: ["id"],
        });
    }

    async getAllFollowings(followingsInfo) {
        let followings = [];
        for (let following of followingsInfo) {
            let user = await this.userModel.findByPk(following.to);
            followings.push(user);
        }
        return followings;
    }

    async getAllFollowers(followersInfo) {
        let followers = [];
        for (let follower of followersInfo) {
            let user = await this.userModel.findByPk(follower.from);
            followers.push(user);
        }
        return followers;
    }

    async getUser(id) {
        return await this.userModel.findByPk(id, {
            attributes: this.SAFE_USER,
        });
    }

    async getRequest(from, to) {
        return await this.followModel.findOne({ where: { from, to } });
    }

    async createRequest(from, to, approved, requested) {
        return await this.followModel.create({
            from,
            to,
            approved,
            requested,
        });
    }
}
