import Image from "./models/images.js";
import fileService from './routes/fileService.js'

class ImageService {
    async create(image) {
        const fileName = fileService.saveFile(image);
        const createdImage = await Image.create({url:fileName});
        return createdImage;
    }

    async getAll() {
        const image = await Image.find();
        return image;
    }
    async getOne(id) {
        if (!id) {
            throw new Error('не указан ID')
        }
        const image = await Image.findById(id);
        return image;
    }

    async update(Image) {
        if (!Image._id) {
            throw new Error('не указан ID')
        }
        const updatedImage = await Image.findByIdAndUpdate(Image._id, Image, {new: true})
        return updatedImage;
    }

    async delete(id) {
            if (!id) {
                throw new Error('не указан ID')
            }
            const image = await Image.findByIdAndDelete(id);
            return image;
    }
}


export default new ImageService();