import ImageService from "./ImageService.js";

class ImageController {
    async create(req, res) {
        console.log(req.body)
        try {
            const Image = await ImageService.create(req.files.Image)
            res.json(Image)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getAll(req, res) {
        try {
            const Image = await ImageService.getAll();
            return res.json(Image);
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async getOne(req, res) {
        try {
            const Image = await ImageService.getOne(req.params.id)
            return res.json(Image)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async update(req, res) {
        try {
            const updatedImage = await ImageService.update(req.body);
            return res.json(updatedImage);
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
    async delete(req, res) {
        try {
            const Image = await ImageService.delete(req.params.id);
            return res.json(Image)
        } catch (e) {
            res.status(500).json(e)
        }
    }
}


export default new ImageController();