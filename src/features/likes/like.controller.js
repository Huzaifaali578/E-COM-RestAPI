import LikeRepository from "./like.repository.js";

export default class LikeController {
    constructor() {
        this.likeRepository = new LikeRepository();
    }

    async likeItem(req, res, next) {
        try {
            const userID = req.userID;
            let { id, type } = req.body;
            if (type !== 'Product' && type !== 'Category') {
                return res.status(400).send("Invalid type");
            }
            if (type === 'Product') {
                await this.likeRepository.likeProduct(userID, id);
            } else if (type === 'Category') {
                await this.likeRepository.likeCategory(userID, id);
            }
            res.status(200).send("Like successfully added");
        } catch (err) {
            next(err);
        }

    }

    async getLike(req, res, next) {
        try {
            const { type, id } = req.query;
            const likes = await this.likeRepository.getLike(type, id);
            return res.status(200).send(likes)
        } catch {
            next(err)
        }
    }
}
