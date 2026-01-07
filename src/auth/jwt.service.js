export class JWTService {
    constructor(jwt) {
        this.jwt = jwt;
    }

    async sign(id) {
        return this.jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
    }
}
