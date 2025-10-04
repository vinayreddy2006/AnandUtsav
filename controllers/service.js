import Service from '../models/Service.js';
import Category from '../models/Category.js';
import ServiceProvider from '../models/ServiceProvider.js';

const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

export const createService = async (req, res) => {
  try {
    const { name, description, images, priceInfo, categoryName } = req.body;
    if (!name || !priceInfo || !categoryName) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, and a category name' });
    }
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await Category.create({ name: categoryName, slug: generateSlug(categoryName) });
    }
    const providerId = req.provider._id;
    const service = await Service.create({
      name, description, images, priceInfo,
      categories: category._id,
      providers: providerId,
    });
    const provider = await ServiceProvider.findById(providerId);
    provider.services.push(service._id);
    await provider.save();
    category.services.push(service._id);
    await category.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).populate('categories', 'name slug').populate('providers', 'name location');
    res.json(services);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('categories', 'name slug').populate('providers', 'name location email phone');
    if (service) {
      res.json(service);
    } else {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providers.toString() !== req.provider._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
    }

    await service.deleteOne();

    await Category.findByIdAndUpdate(service.categories, {
      $pull: { services: service._id }
    });
    await ServiceProvider.findByIdAndUpdate(service.providers, {
      $pull: { services: service._id }
    });

    res.status(200).json({ success: true, message: 'Service removed successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providers.toString() !== req.provider._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
    }


    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;
    service.priceInfo = req.body.priceInfo || service.priceInfo;
    service.images = req.body.images || service.images;
    service.availability = req.body.availability !== undefined ? req.body.availability : service.availability;

    const updatedService = await service.save();

    res.status(200).json(updatedService);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
