const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Initial seed/mock projects in case database is empty or offline
const mockProjects = [
  {
    _id: 'mock-proj-1',
    title: 'RoadSoS: Real-Time Accident Monitor',
    description: 'A full-stack safety response system that utilizes mobile accelerometer sensors to detect traffic accidents and alerts emergency dispatch centers in real-time via WebSockets and dashboards.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Expo', 'WebSockets'],
    githubLink: 'https://github.com/shubham-chavan/road-sos',
    liveDemoLink: '#',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    category: 'Web Development',
    featured: true,
    createdAt: new Date('2026-05-15')
  },
  {
    _id: 'mock-proj-2',
    title: 'IoT Smart Agriculture Irrigation System',
    description: 'An automated farming solution utilizing ESP32 microcontroller sensors to measure soil moisture, temperature, and humidity, sending live telemetry to a glassmorphic dashboard for auto-irrigation trigger.',
    techStack: ['React.js', 'Node.js', 'ESP32', 'C++', 'MQTT', 'MongoDB'],
    githubLink: 'https://github.com/shubham-chavan/iot-smart-farm',
    liveDemoLink: '#',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    category: 'IoT/Hardware',
    featured: true,
    createdAt: new Date('2026-04-10')
  },
  {
    _id: 'mock-proj-3',
    title: 'AI Edge Object Detection Scanner',
    description: 'A deep learning application utilizing TensorFlow Lite and OpenCV to recognize and classify electronic components on a conveyor belt in real-time, designed for automated factory quality control.',
    techStack: ['Python', 'TensorFlow Lite', 'OpenCV', 'React.js', 'Flask'],
    githubLink: 'https://github.com/shubham-chavan/ai-component-detector',
    liveDemoLink: '#',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    category: 'AI/ML',
    featured: true,
    createdAt: new Date('2026-03-01')
  },
  {
    _id: 'mock-proj-4',
    title: 'Secure File Locker on IPFS',
    description: 'A decentralized cryptographic storage system designed to secure personal files. Implements AES-256 encryption client-side and uploads fragmented data blocks to InterPlanetary File System (IPFS).',
    techStack: ['HTML', 'CSS', 'JavaScript', 'IPFS', 'Web3', 'Node.js'],
    githubLink: 'https://github.com/shubham-chavan/ipfs-locker',
    liveDemoLink: '#',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    category: 'Web Development',
    featured: false,
    createdAt: new Date('2026-01-20')
  }
];

// Memory store fallback if DB is not connected
let memoryProjects = [...mockProjects];

// Helper to check DB connection
const getDbStatus = (req) => req.app.get('dbConnected');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (getDbStatus(req)) {
      let projects = await Project.find().sort({ createdAt: -1 });
      // If DB connected but empty, seed memory projects for initial display
      if (projects.length === 0) {
        // Strip out the custom mock IDs so MongoDB generates its own
        const seedData = mockProjects.map(({ _id, ...rest }) => rest);
        projects = await Project.insertMany(seedData);
      }
      res.json(projects);
    } else {
      res.json(memoryProjects);
    }
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  const { title, description, techStack, githubLink, liveDemoLink, image, category, featured } = req.body;

  if (!title || !description || !techStack || !category) {
    return res.status(400).json({ message: 'Please include title, description, tech stack, and category' });
  }

  try {
    if (getDbStatus(req)) {
      const newProject = new Project({
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
        githubLink,
        liveDemoLink,
        image,
        category,
        featured: featured || false
      });

      const project = await newProject.save();
      res.json(project);
    } else {
      const mockNewProject = {
        _id: 'mock-proj-' + Date.now(),
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
        githubLink: githubLink || '',
        liveDemoLink: liveDemoLink || '',
        image: image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        category,
        featured: featured || false,
        createdAt: new Date()
      };
      memoryProjects.unshift(mockNewProject);
      res.json(mockNewProject);
    }
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Server error saving project' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, description, techStack, githubLink, liveDemoLink, image, category, featured } = req.body;

  try {
    if (getDbStatus(req)) {
      let project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      // Update fields if present
      if (title) project.title = title;
      if (description) project.description = description;
      if (techStack) project.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim());
      if (githubLink !== undefined) project.githubLink = githubLink;
      if (liveDemoLink !== undefined) project.liveDemoLink = liveDemoLink;
      if (image) project.image = image;
      if (category) project.category = category;
      if (featured !== undefined) project.featured = featured;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      let index = memoryProjects.findIndex(p => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Project not found' });

      const updated = {
        ...memoryProjects[index],
        title: title || memoryProjects[index].title,
        description: description || memoryProjects[index].description,
        techStack: techStack ? (Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim())) : memoryProjects[index].techStack,
        githubLink: githubLink !== undefined ? githubLink : memoryProjects[index].githubLink,
        liveDemoLink: liveDemoLink !== undefined ? liveDemoLink : memoryProjects[index].liveDemoLink,
        image: image || memoryProjects[index].image,
        category: category || memoryProjects[index].category,
        featured: featured !== undefined ? featured : memoryProjects[index].featured
      };
      memoryProjects[index] = updated;
      res.json(updated);
    }
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (getDbStatus(req)) {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: 'Project removed successfully' });
    } else {
      const initialLength = memoryProjects.length;
      memoryProjects = memoryProjects.filter(p => p._id !== req.params.id);
      if (memoryProjects.length === initialLength) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json({ message: 'Project removed successfully (mock memory)' });
    }
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

module.exports = router;
