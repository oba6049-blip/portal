import { Course, Testimonial, FAQItem } from './types';

export const COURSES: Course[] = [
  // Artificial Intelligence
  {
    id: 'ai-gen-fundamentals',
    title: 'Generative AI Fundamentals',
    description: 'Understand the power and mechanics of large language models, neural embeddings, and diffusion architectures.',
    duration: '4 Weeks',
    iconName: 'Sparkles',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-prompt-eng',
    title: 'Prompt Engineering',
    description: 'Master advanced instruction engineering techniques, chain-of-thought protocols, and structured output formatting.',
    duration: '2 Weeks',
    iconName: 'Sliders',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-chatgpt-mastery',
    title: 'ChatGPT Mastery',
    description: 'Learn to leverage custom GPTs, workflow automation, code interpreter modes, and advanced workspaces.',
    duration: '3 Weeks',
    iconName: 'MessageSquareText',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-prod-tools',
    title: 'AI Productivity Tools',
    description: 'Accelerate your digital operations using top-tier text generators, voice synths, and automated video workflows.',
    duration: '3 Weeks',
    iconName: 'Zap',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-agent-dev',
    title: 'AI Agent Development',
    description: 'Code stateful, self-correcting autonomous agents using LangChain, CrewAI, and Gemini tool-calling integrations.',
    duration: '6 Weeks',
    iconName: 'Cpu',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-ml-fundamentals',
    title: 'Machine Learning Fundamentals',
    description: 'Core numeric and statistical methods including linear regression, clustering, random forests, and gradient boosting.',
    duration: '8 Weeks',
    iconName: 'Binary',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-deep-learning',
    title: 'Deep Learning Essentials',
    description: 'Build and train neural networks, CNNs for vision, and Transformers using modern frameworks.',
    duration: '8 Weeks',
    iconName: 'Network',
    category: 'Artificial Intelligence'
  },
  {
    id: 'ai-for-business',
    title: 'AI for Business',
    description: 'Formulate, evaluate, and launch enterprise AI integration initiatives safely and profitably.',
    duration: '4 Weeks',
    iconName: 'Briefcase',
    category: 'Artificial Intelligence'
  },

  // Cloud Computing
  {
    id: 'cloud-azure-fund',
    title: 'Microsoft Azure Fundamentals',
    description: 'Core cloud concepts, pricing, security rules, and architectural standards of the Microsoft Azure platform.',
    duration: '4 Weeks',
    iconName: 'Cloud',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-azure-admin',
    title: 'Azure Administrator',
    description: 'Manage identities, virtual subnetworks, storage layers, and active directory infrastructure.',
    duration: '6 Weeks',
    iconName: 'ShieldAlert',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-azure-ai-eng',
    title: 'Azure AI Engineer',
    description: 'Build enterprise AI features using Cognitive Services, custom models, and Semantic search patterns.',
    duration: '6 Weeks',
    iconName: 'Brain',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-azure-devops',
    title: 'Azure DevOps Engineer',
    description: 'Design CI/CD pipelines, package feeds, and self-hosted build runners matching professional enterprise standards.',
    duration: '8 Weeks',
    iconName: 'Workflow',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-azure-sec',
    title: 'Azure Security Engineer',
    description: 'Implement enterprise network isolation zones, conditional access controls, and active threat detection.',
    duration: '6 Weeks',
    iconName: 'ShieldCheck',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-aws-prac',
    title: 'AWS Cloud Practitioner',
    description: 'Introductory guide to EC2 compute cores, S3 data arrays, IAM groups, and baseline billings.',
    duration: '4 Weeks',
    iconName: 'Cloud',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-aws-arch',
    title: 'AWS Solutions Architect',
    description: 'Design highly available, self-healing, multi-tier microservices systems across elastic global availability zones.',
    duration: '8 Weeks',
    iconName: 'Server',
    category: 'Cloud Computing'
  },
  {
    id: 'cloud-gcp-fund',
    title: 'Google Cloud Fundamentals',
    description: 'Run dockerized engines, serverless Cloud Functions, Google BigQuery clusters, and cloud storage systems securely.',
    duration: '4 Weeks',
    iconName: 'Google',
    category: 'Cloud Computing'
  },

  // Programming & Development
  {
    id: 'prog-html-css',
    title: 'HTML & CSS',
    description: 'Build pixel-perfect, fully responsive web page designs using modern CSS Grid, Flexbox, and fluid typography.',
    duration: '3 Weeks',
    iconName: 'Code',
    category: 'Programming & Development'
  },
  {
    id: 'prog-js',
    title: 'JavaScript',
    description: 'Master asynchronous events, lexical scopes, closures, API fetches, and dynamic UI DOM controls.',
    duration: '6 Weeks',
    iconName: 'FileCode',
    category: 'Programming & Development'
  },
  {
    id: 'prog-react',
    title: 'React Development',
    description: 'Build scalable modern single page applications with states, effects, custom hooks, and state managers.',
    duration: '6 Weeks',
    iconName: 'Atom',
    category: 'Programming & Development'
  },
  {
    id: 'prog-python',
    title: 'Python Programming',
    description: 'Core Python data types, loops, functional abstractions, file scrapers, and package manipulation.',
    duration: '5 Weeks',
    iconName: 'Play',
    category: 'Programming & Development'
  },
  {
    id: 'prog-node',
    title: 'Node.js Development',
    description: 'Build fast full-stack server backends with asynchronous REST routing, middleware, and filesystem manipulation.',
    duration: '6 Weeks',
    iconName: 'ServerCrash',
    category: 'Programming & Development'
  },
  {
    id: 'prog-fullstack',
    title: 'Full Stack Web Development',
    description: 'Unify frontend React with backend Node/Express and databases into self-contained operational apps.',
    duration: '12 Weeks',
    iconName: 'Globe',
    category: 'Programming & Development'
  },
  {
    id: 'prog-mobile',
    title: 'Mobile App Development',
    description: 'Compile high-quality, native cross-platform iOS and Android applications utilizing React Native.',
    duration: '8 Weeks',
    iconName: 'Smartphone',
    category: 'Programming & Development'
  },

  // Data Analytics
  {
    id: 'data-excel',
    title: 'Data Analysis with Excel',
    description: 'Master complex multi-condition logic formulas, Pivot Tables, conditional audits, and custom data charts.',
    duration: '3 Weeks',
    iconName: 'FileSpreadsheet',
    category: 'Data Analytics'
  },
  {
    id: 'data-sql',
    title: 'SQL Database Management',
    description: 'Structure tables, compose multi-join queries, optimize schema indexes, and aggregate data securely.',
    duration: '4 Weeks',
    iconName: 'Database',
    category: 'Data Analytics'
  },
  {
    id: 'data-powerbi',
    title: 'Power BI',
    description: 'Construct interactive business dashboards, configure dynamic reports, and model relational corporate metrics.',
    duration: '4 Weeks',
    iconName: 'BarChart3',
    category: 'Data Analytics'
  },
  {
    id: 'data-science-python',
    title: 'Data Science with Python',
    description: 'Clean data records, execute statistical projections, and visualize insights with Pandas, NumPy, and Matplotlib.',
    duration: '8 Weeks',
    iconName: 'LineChart',
    category: 'Data Analytics'
  },

  // DevOps & Infrastructure
  {
    id: 'devops-git',
    title: 'Git & GitHub',
    description: 'Branch strategies, resolving merge conflicts, pulling requests, and establishing continuous team repositories.',
    duration: '2 Weeks',
    iconName: 'GitBranch',
    category: 'DevOps & Infrastructure'
  },
  {
    id: 'devops-docker',
    title: 'Docker',
    description: 'Encapsulate and compile application builds into portable server-independent Linux containers.',
    duration: '3 Weeks',
    iconName: 'Layers',
    category: 'DevOps & Infrastructure'
  },
  {
    id: 'devops-k8s',
    title: 'Kubernetes',
    description: 'Orchestrate distributed containers, define replica nodes, and configuration templates in complex production environments.',
    duration: '6 Weeks',
    iconName: 'Orbit',
    category: 'DevOps & Infrastructure'
  },
  {
    id: 'devops-linux',
    title: 'Linux Administration',
    description: 'Command line utilities, access control permissions, bash scheduling automation, and network connection diagnostics.',
    duration: '4 Weeks',
    iconName: 'Terminal',
    category: 'DevOps & Infrastructure'
  },
  {
    id: 'devops-cicd',
    title: 'CI/CD Pipelines',
    description: 'Engineer hands-off code integration and automatic delivery pipelines with GitHub Actions.',
    duration: '4 Weeks',
    iconName: 'Repeat',
    category: 'DevOps & Infrastructure'
  },
  {
    id: 'devops-iac',
    title: 'Infrastructure as Code',
    description: 'Design declarative, reproducible hardware deployments with Terraform scripting.',
    duration: '4 Weeks',
    iconName: 'Settings',
    category: 'DevOps & Infrastructure'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Adaobi Chen',
    role: 'Cloud Security Analyst at Access Bank',
    quote: 'The hands-on practical learning at Textocode was a game-changer. Re-building Azure and AWS enterprise systems from scratch helped me pass my certifications first try!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'Associate AI Engineer at TechSynergy',
    quote: 'Textocode is not about boring slideshow slides. We literally built functional Multi-Agent AI systems using Python that solved actual business data pipelines. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-3',
    name: 'Fatima Bashir',
    role: 'Junior Fullstack Dev at Flutterwave',
    quote: 'The team mentor program bridged the gap from coding basics to building actual web structures. The React and Node.js syllabus was incredibly up-to-date and challenging.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-4',
    name: 'Ebenezer Kalu',
    role: 'DevOps Lead at Interswitch',
    quote: 'I came in with minimal Docker knowledge and left orchestrating stateful high-availability Kubernetes deployments. The curriculum is extremely detailed and industry-aligned.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is the commitment and average duration of your courses?',
    answer: 'Our programs generally range from 2 weeks for short, targeted skill sprints (like Git or Prompt Engineering) to 12 weeks for comprehensive Career Tracks (like Full Stack Development). Plan on dedicating 4 to 8 hours per week depending on the course intensity.'
  },
  {
    id: 'faq-2',
    question: 'Will I receive a professional verification certificate?',
    answer: 'Yes! Upon successful completion of all project deliverables, capstones, and quizzes, you will be awarded an industry-recognized, globally verifiable digital certificate of achievement from Textocode Academy.'
  },
  {
    id: 'faq-3',
    question: 'What payment structures and scholarship options are available?',
    answer: 'We provide structured payment installments, early-bird pricing discounts, and merit-based partial scholarships. Detailed package options are sent to qualified students upon review of their registration form.'
  },
  {
    id: 'faq-4',
    question: 'How are physical and online learning schedules structured?',
    answer: 'Online courses utilize live interactive webinars supplemented by pre-recorded guides. Physical cohorts hold interactive in-lab sessions with on-site trainers. Weekend or weekday evening cohorts are available to wrap around busy work schedules.'
  },
  {
    id: 'faq-5',
    question: 'Are there realistic guarantees for internships and career mentorship?',
    answer: 'Absolutely. We partner with over 40 technology consulting groups to offer structured internship pipelines, resume audits, technical mock interviews, and continuous direct career counselor sessions.'
  },
  {
    id: 'faq-6',
    question: 'I am a complete beginner in computer science. Can I enroll?',
    answer: 'Yes! Our course pathways are tier-graded. We begin from the foundational building blocks (like basic HTML, Python paradigms, and baseline Cloud concepts) and scale to complex operations, so no prior tech experience is required.'
  }
];
